import { Component, OnInit } from '@angular/core';
import { Chamado } from '../shared/chamado.interface';
import { Subscription } from 'rxjs';
import { ChamadoService } from 'src/app/services/chamado.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private chamados = new Array<Chamado>();
  private chamadoSubscription: Subscription;
  private loading: any;


  constructor(private chamadoService: ChamadoService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private router: Router,
  ) {
    this.chamadoSubscription = this.chamadoService.getChamados().subscribe(data => {
      this.chamados = data;
    });
  }

  ngOnInit() {
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.chamadoSubscription.unsubscribe();
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
    }

  }

  async deleteChamado(id: string) {
    try {
      await this.chamadoService.deleteChamado(id);
    } catch (error) {
      this.presentToast('Erro ao tentar salvar.');
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
