import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AlertController, LoadingController, ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.component.html',
  styleUrls: ['./take-photo.component.scss'],
})
export class TakePhotoComponent implements OnInit {
  @Output() photoTaken = new EventEmitter<Photo>();
  @Output() photoCanceled = new EventEmitter<void>();

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {}

  /**
   * Open the camera to take a photo
   */
  async openCamera() {
    try {
      // 1. Check and request camera permissions
      const hasPermission = await this.checkCameraPermissions();
      if (!hasPermission) {
        await this.showPermissionDeniedAlert();
        this.photoCanceled.emit();
        console.log('Camera permission denied');
        return;
      }

      console.log('Camera permission granted');

      // 2. Show loading while opening camera
      const loading = await this.loadingController.create({
        message: 'Opening camera...',
      });
      await loading.present();

      // 3. Open camera and get the photo
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: false,
        direction: CameraDirection.Rear,
      });

      await loading.dismiss();

      // 4. Return the photo to the caller
      this.photoTaken.emit(photo);
      
      await this.showSuccessToast('Photo captured successfully!');

    } catch (error) {
      await this.loadingController.dismiss();
      console.error('Error taking photo:', error);
      
      if (error === 'User cancelled photos app') {
        this.photoCanceled.emit();
      } else {
        await this.showErrorAlert('Failed to take photo. Please try again.');
        this.photoCanceled.emit();
      }
    }
  }

  /**
   * Open photo gallery to select an existing photo
   */
  async openGallery() {
    try {
      // Check gallery permissions
      const hasPermission = await this.checkGalleryPermissions();
      if (!hasPermission) {
        await this.showPermissionDeniedAlert();
        this.photoCanceled.emit();
        return;
      }

      const loading = await this.loadingController.create({
        message: 'Opening gallery...',
        duration: 1000
      });
      await loading.present();

      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      await loading.dismiss();
      this.photoTaken.emit(photo);
      
      await this.showSuccessToast('Photo selected successfully!');

    } catch (error) {
      await this.loadingController.dismiss();
      console.error('Error selecting photo:', error);
      
      if (error === 'User cancelled photos app') {
        this.photoCanceled.emit();
      } else {
        await this.showErrorAlert('Failed to select photo. Please try again.');
        this.photoCanceled.emit();
      }
    }
  }

  /**
   * Show options to choose between camera or gallery
   * Only shows options if permissions are granted
   */
  async showPhotoOptions() {
    try {
      // Check both camera and gallery permissions first
      const cameraPermission = await this.checkCameraPermissions();
      const galleryPermission = await this.checkGalleryPermissions();

      // If no permissions granted, show permission denied alert
      if (!cameraPermission && !galleryPermission) {
        await this.showPermissionDeniedAlert();
        this.photoCanceled.emit();
        return;
      }

      // Create buttons array based on available permissions
      const buttons: any[] = [];

      if (cameraPermission) {
        buttons.push({
          text: '📷 Camera',
          handler: () => this.openCamera()
        });
      }

      if (galleryPermission) {
        buttons.push({
          text: '🖼️ Gallery',
          handler: () => this.openGallery()
        });
      }

      buttons.push({
        text: 'Cancel',
        role: 'cancel',
        handler: () => this.photoCanceled.emit()
      });

      // Show alert with available options
      const alert = await this.alertController.create({
        header: 'Select Photo Source',
        message: 'Choose how you want to add a photo',
        buttons: buttons
      });

      await alert.present();

    } catch (error) {
      console.error('Error showing photo options:', error);
      await this.showErrorAlert('Unable to access camera or gallery. Please check permissions.');
      this.photoCanceled.emit();
    }
  }

  /**
   * Check camera permissions
   */
  private async checkCameraPermissions(): Promise<boolean> {
    try {
      const permissions = await Camera.checkPermissions();
      
      if (permissions.camera === 'granted') {
        return true;
      }

      if (permissions.camera === 'denied') {
        return false;
      }

      // Request permission if not determined
      const requestResult = await Camera.requestPermissions();
      return requestResult.camera === 'granted';
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      return false;
    }
  }

  /**
   * Check gallery permissions
   */
  private async checkGalleryPermissions(): Promise<boolean> {
    try {
      const permissions = await Camera.checkPermissions();
      
      if (permissions.photos === 'granted') {
        return true;
      }

      if (permissions.photos === 'denied') {
        return false;
      }

      // Request permission if not determined
      const requestResult = await Camera.requestPermissions();
      return requestResult.photos === 'granted';
    } catch (error) {
      console.error('Error checking gallery permissions:', error);
      return false;
    }
  }

  /**
   * Show permission denied alert
   */
  private async showPermissionDeniedAlert() {
    const alert = await this.alertController.create({
      header: 'Permission Required',
      message: 'Camera permission is required to take photos. Please enable it in your device settings.',
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Show error alert
   */
  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Show success toast
   */
  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}
