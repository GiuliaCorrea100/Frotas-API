/* eslint-disable prettier/prettier */
// src/dbsigaa/sigaa-pool-manager.service.ts (COM BACKOFF)
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SigaaPoolManager implements OnApplicationBootstrap {
  private isPoolWarm = false;
  private recoveryAttempts = 0;
  private readonly MAX_RECOVERY_ATTEMPTS = 10;

  constructor(
    @InjectDataSource('sigaaConnection') private sigaaDataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    await this.warmUpPool();
    this.startKeepAlive();
  }

  private async warmUpPool() {
    try {
      console.log(`🔥 Tentativa ${this.recoveryAttempts + 1} de aquecer pool SIGAA...`);
      
      await this.sigaaDataSource.query('SELECT 1');
      
      this.isPoolWarm = true;
      this.recoveryAttempts = 0;
      console.log('✅ Pool SIGAA aquecido com sucesso!');
      
    } catch (error) {
      // Corrigindo o acesso à propriedade message
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Erro ao aquecer pool SIGAA:', errorMessage);
      
      this.isPoolWarm = false;
      this.recoveryAttempts++;
      
      if (this.recoveryAttempts < this.MAX_RECOVERY_ATTEMPTS) {
        // Exponential backoff: 10s, 20s, 40s, 80s...
        const backoffTime = Math.min(1000 * Math.pow(2, this.recoveryAttempts), 300000);
        console.log(`⏳ Próxima tentativa em ${backoffTime/1000} segundos...`);
        setTimeout(() => this.warmUpPool(), backoffTime);
      } else {
        console.error('🚫 Máximo de tentativas de recuperação atingido');
      }
    }
  }

  private startKeepAlive() {
    setInterval(async () => {
      if (this.isPoolWarm) {
        try {
          await this.sigaaDataSource.query('SELECT 1');
          console.log('❤️  Keep-alive SIGAA: OK - ' + new Date().toLocaleTimeString());
        } catch (error) {
          console.error('💔 Keep-alive SIGAA falhou, iniciando recuperação...');
          this.isPoolWarm = false;
          this.recoveryAttempts = 0;
          await this.warmUpPool();
        }
      }
    }, 900000); // 15 minutos
  }

  getPoolStatus() {
    return {
      isWarm: this.isPoolWarm,
      recoveryAttempts: this.recoveryAttempts,
      timestamp: new Date().toISOString()
    };
  }
}