import { Component, OnInit } from '@angular/core';
import { Chamado } from '../shared/chamado.interface';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChamadoService } from 'src/app/services/chamado.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  private chamado: Chamado = {};
  private loading: any;
  private chamadoId: string = null;
  private chamadoSubscription: Subscription;
  private keyboard: Keyboard;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private chamadoService: ChamadoService,
    private NavCtrl: NavController
  ) {
    this.chamadoId = this.activeRoute.snapshot.params.id;
    if (this.chamadoId) { this.loadChamado(); }
  }

  ngOnInit() {
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.chamadoSubscription) { this.chamadoSubscription.unsubscribe(); }
  }

  loadChamado() {
    this.chamadoSubscription = this.chamadoService.getChamado(this.chamadoId).subscribe(data => {
      this.chamado = data;
    });
  }

  async saveChamado() {
    await this.presentLoading();

    this.chamado.userId = this.authService.getAuth().currentUser.uid;

    if (this.chamadoId) {

      try {
        await this.chamadoService.updateChamado(this.chamadoId, this.chamado);
        await this.loading.dismiss();

        this.NavCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar.');
        this.loading.dismiss();
        console.error(error);
      }

    } else {
      this.chamado.createdAt = new Date().getTime();

      try {
        await this.chamadoService.addChamado(this.chamado);
        await this.loading.dismiss();

        this.NavCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar.');
        this.loading.dismiss();
      }
    }

  }

  async deleteChamado(id: string) {
    try {
      await this.chamadoService.deleteChamado(id);

      this.NavCtrl.navigateBack('/home');
    } catch (error) {
      this.presentToast('Erro ao tentar finalizar.');
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

  /*
  takeSelfie() {
    try{
    this.camera.getPicture({
      quality : 100,
      destinationType : this.cameraPlugin.DestinationType.DATA_URL,
      sourceType : this.cameraPlugin.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: this.cameraPlugin.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then(profilePicture => {
      // Send the picture to Firebase Storage
      const selfieRef = firebase.storage().ref('foto.png');
      selfieRef
        .putString(profilePicture, 'base64', {contentType: 'image/png'})
        .then(savedProfilePicture => {
          firebase
            .database()
            .ref(`users/user1/profilePicture`)
            .set(savedProfilePicture.downloadURL);
        });
    });
  } catch (error){
    console.error(error);
  }

}
*/
}
