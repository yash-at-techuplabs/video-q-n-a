import type { AppState } from './types';
import { questions } from './types';

export class VideoQAApp {
  private state: AppState;
  private elements: { [key: string]: HTMLElement | null } = {};
  private recordingTimer: number | null = null;
  private countdownTimer: number | null = null;
  private preRecordingCountdownTimer: number | null = null;
  private readonly MAX_RECORDING_TIME = 1 * 60 * 1000; // 1 minutes in milliseconds;

  constructor() {
    this.state = {
      currentQuestionIndex: 0,
      mediaRecorder: null,
      recordedChunks: [],
      userInfo: null,
      videoStream: null,
      isRecording: false,
      facingMode: 'user',
      currentRecording: null
    };
    
    this.initializeElements();
    this.setupEventListeners();
    this.initializeFeatherIcons();
  }

  private initializeElements(): void {
    this.elements = {
      userInfoModal: document.getElementById('userInfoModal'),
      appContainer: document.getElementById('appContainer'),
      completionModal: document.getElementById('completionModal'),
      userInfoForm: document.getElementById('userInfoForm'),
      recordButton: document.getElementById('recordButton'),
      recordingIndicator: document.getElementById('recordingIndicator'),
      recordingTimer: document.getElementById('recordingTimer'),
      currentQuestion: document.getElementById('currentQuestion'),
      currentStep: document.getElementById('currentStep'),
      totalSteps: document.getElementById('totalSteps'),
      videoElement: document.getElementById('videoElement') as HTMLVideoElement,
      restartButton: document.getElementById('restartButton'),
      userName: document.getElementById('userName') as HTMLInputElement,
      userEmail: document.getElementById('userEmail') as HTMLInputElement,
      notesButton: document.getElementById('notesButton'),
      flipCameraButton: document.getElementById('flipCameraButton'),
      notesInput: document.getElementById('notesInput') as HTMLTextAreaElement,
      permissionCheckbox: document.getElementById('permissionCheckbox') as HTMLInputElement,
      countdownOverlay: document.getElementById('countdownOverlay'),
      countdownNumber: document.getElementById('countdownNumber'),
      recordingConfirmationModal: document.getElementById('recordingConfirmationModal'),
      retryRecordingButton: document.getElementById('retryRecordingButton'),
      confirmRecordingButton: document.getElementById('confirmRecordingButton'),
      confirmationStep: document.getElementById('confirmationStep'),
      confirmationTotalSteps: document.getElementById('confirmationTotalSteps'),
      confirmationQuestion: document.getElementById('confirmationQuestion'),
      recordingPreview: document.getElementById('recordingPreview') as HTMLVideoElement
    };
  }

  private initializeFeatherIcons(): void {
    // Initialize feather icons
    if (typeof (window as any).feather !== 'undefined') {
      (window as any).feather.replace();
    }
  }

  private setupEventListeners(): void {
    this.elements.userInfoForm?.addEventListener('submit', (e) => this.handleUserInfoSubmit(e));
    this.elements.recordButton?.addEventListener('click', () => this.toggleRecording());
    this.elements.restartButton?.addEventListener('click', () => this.handleRestart());
    this.elements.flipCameraButton?.addEventListener('click', () => this.flipCamera());
    this.elements.notesButton?.addEventListener('click', () => this.toggleNotes());
    this.elements.retryRecordingButton?.addEventListener('click', () => this.handleRetryRecording());
    this.elements.confirmRecordingButton?.addEventListener('click', () => this.handleConfirmRecording());
    
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  public initialize(): void {
    this.updateTotalQuestions();
    this.updateQuestion();
  }

  private updateTotalQuestions(): void {
    const totalQuestionsCount = questions.filter(q => !q.isThankYou).length;
    if (this.elements.totalSteps) {
      this.elements.totalSteps.textContent = totalQuestionsCount.toString();
    }
  }

  private handleUserInfoSubmit(e: Event): void {
    e.preventDefault();
    
    const userName = this.elements.userName as HTMLInputElement;
    const userEmail = this.elements.userEmail as HTMLInputElement;
    const permissionCheckbox = this.elements.permissionCheckbox as HTMLInputElement;
    
    if (!userName.value || !userEmail.value) {
      alert('Please fill in all fields');
      return;
    }

    if (!permissionCheckbox.checked) {
      alert('Please grant permission to share this review');
      return;
    }

    this.state.userInfo = {
      name: userName.value,
      email: userEmail.value
    };

    this.hideModal('userInfoModal');
    this.showElement('appContainer');
    this.startCamera();
  }

  private handleRestart(): void {
    this.hideModal('completionModal');
    this.state.currentQuestionIndex = 0;
    this.updateQuestion();
    this.startCamera();
  }

  private handleRetryRecording(): void {
    this.hideModal('recordingConfirmationModal');
    
    // Discard the current recording
    if (this.state.currentRecording) {
      URL.revokeObjectURL(this.state.currentRecording.videoUrl);
      this.state.currentRecording = null;
    }
    
    // Clear recorded chunks for new recording
    this.state.recordedChunks = [];
    
    // Stay on the same question and allow re-recording
    this.updateQuestion();
  }

  private handleConfirmRecording(): void {
    this.hideModal('recordingConfirmationModal');
    
    // Save the confirmed recording
    if (this.state.currentRecording) {
      const downloadLink = document.createElement('a');
      downloadLink.href = this.state.currentRecording.videoUrl;
      downloadLink.download = `question-${this.state.currentRecording.questionIndex + 1}-${this.state.userInfo?.name || 'user'}.webm`;
      
      // Download the video
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      console.log('Recording confirmed and saved for question:', questions[this.state.currentRecording.questionIndex].text);
      console.log('Video downloaded:', downloadLink.download);
      
      // Clean up the current recording
      this.state.currentRecording = null;
    }
    
    // Move to next question
    this.state.currentQuestionIndex++;
    this.updateQuestion();
  }

  private updateConfirmationModal(): void {
    const currentQuestion = questions[this.state.currentQuestionIndex];
    const totalQuestionsCount = questions.filter(q => !q.isThankYou).length;
    
    if (this.elements.confirmationStep) {
      this.elements.confirmationStep.textContent = (this.state.currentQuestionIndex + 1).toString();
    }
    
    if (this.elements.confirmationTotalSteps) {
      this.elements.confirmationTotalSteps.textContent = totalQuestionsCount.toString();
    }
    
    if (this.elements.confirmationQuestion) {
      this.elements.confirmationQuestion.textContent = currentQuestion.text;
    }
    
    // Set the video preview source
    if (this.elements.recordingPreview && this.state.currentRecording) {
      this.elements.recordingPreview.src = this.state.currentRecording.videoUrl;
      this.elements.recordingPreview.load(); // Reload the video element
    }
  }

  private updateQuestion(): void {
    const question = questions[this.state.currentQuestionIndex];
    
    if (this.elements.currentQuestion) {
      this.elements.currentQuestion.textContent = question.text;
    }
    
    if (this.elements.currentStep) {
      this.elements.currentStep.textContent = (this.state.currentQuestionIndex + 1).toString();
    }

    // Reset timer display
    this.resetTimerDisplay();

    if (question.isThankYou) {
      this.hideElement('appContainer');
      this.showModal('completionModal');
      this.stopCamera();
    }
  }

  private resetTimerDisplay(): void {
    const timerElement = this.elements.recordingTimer;
    if (timerElement) {
      timerElement.textContent = '1:00';
      timerElement.classList.remove('text-red-600', 'font-bold');
    }
  }

  private async startCamera(): Promise<void> {
    try {
      if (this.state.videoStream) {
        this.state.videoStream.getTracks().forEach(track => track.stop());
      }

      this.state.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.state.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });

      const videoElement = this.elements.videoElement as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = this.state.videoStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access the camera. Please ensure you have granted camera permissions.');
    }
  }

  private stopCamera(): void {
    if (this.state.videoStream) {
      this.state.videoStream.getTracks().forEach(track => track.stop());
      const videoElement = this.elements.videoElement as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = null;
      }
    }
  }

  private toggleRecording(): void {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      this.startCountdown();
    }
  }

  private startCountdown(): void {
    if (!this.state.videoStream) {
      alert('Camera not available');
      return;
    }

    // Show countdown overlay
    this.showElement('countdownOverlay');
    
    let count = 3;
    const countdownNumber = this.elements.countdownNumber;
    if (countdownNumber) {
      countdownNumber.textContent = count.toString();
    }

    this.preRecordingCountdownTimer = window.setInterval(() => {
      count--;
      if (countdownNumber) {
        countdownNumber.textContent = count.toString();
      }
      
      if (count <= 0) {
        this.hideElement('countdownOverlay');
        if (this.preRecordingCountdownTimer) {
          clearInterval(this.preRecordingCountdownTimer);
          this.preRecordingCountdownTimer = null;
        }
        this.startRecording();
      }
    }, 1000);
  }

  private startRecording(): void {
    if (!this.state.videoStream) {
      alert('Camera not available');
      return;
    }

    this.state.recordedChunks = [];

    try {
      this.state.mediaRecorder = new MediaRecorder(this.state.videoStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      this.state.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.state.recordedChunks.push(event.data);
        }
      };

      this.state.mediaRecorder.onstop = () => {
        this.saveRecording();
      };

      this.state.mediaRecorder.start(100);
      this.state.isRecording = true;
      this.updateRecordButton();
      this.showElement('recordingIndicator');

      // Start countdown timer
      this.startCountdownTimer();

      // Set up auto-stop timer (2 minutes max)
      this.recordingTimer = window.setTimeout(() => {
        this.stopRecording();
      }, this.MAX_RECORDING_TIME);

    } catch (err) {
      console.error('Error starting recording:', err);
      alert('Could not start recording. Please try again.');
    }
  }

  private stopRecording(): void {
    if (this.state.mediaRecorder && this.state.mediaRecorder.state === 'recording') {
      this.state.mediaRecorder.stop();
      this.state.isRecording = false;
      this.updateRecordButton();
      this.hideElement('recordingIndicator');
      
      // Clear the timers
      if (this.recordingTimer) {
        clearTimeout(this.recordingTimer);
        this.recordingTimer = null;
      }
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
    }
  }

  private startCountdownTimer(): void {
    let timeRemaining = this.MAX_RECORDING_TIME / 1000; // Convert to seconds
    
    this.countdownTimer = window.setInterval(() => {
      timeRemaining--;
      this.updateTimerDisplay(timeRemaining);
      
      if (timeRemaining <= 0) {
        this.stopRecording();
      }
    }, 1000);
  }

  private updateTimerDisplay(seconds: number): void {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const display = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    const timerElement = this.elements.recordingTimer;
    if (timerElement) {
      timerElement.textContent = display;
      
      // Change color when time is running out
      if (seconds <= 30) {
        timerElement.classList.add('text-red-600', 'font-bold');
      }
    }
  }

  private updateRecordButton(): void {
    const button = this.elements.recordButton;
    if (!button) return;

    if (this.state.isRecording) {
      button.innerHTML = `<div class="w-6 h-6 bg-red-500 rounded-sm"></div>`;
      button.classList.add('recording');
    } else {
      button.innerHTML = `<div class="w-8 h-8 rounded-full bg-red-500"></div>`
      button.classList.remove('recording');
    }
  }

  private async flipCamera(): Promise<void> {
    this.state.facingMode = this.state.facingMode === 'user' ? 'environment' : 'user';
    await this.startCamera();
  }

  private toggleNotes(): void {
    const questionOverlay = document.querySelector('.absolute.top-16') as HTMLElement;
    if (questionOverlay) {
      const notesSection = questionOverlay.querySelector('#notesInput')?.parentElement;
      if (notesSection) {
        notesSection.classList.toggle('hidden');
      }
    }
  }

  private saveRecording(): void {
    const blob = new Blob(this.state.recordedChunks, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);

    // Store the recording data for potential retry or confirmation
    this.state.currentRecording = {
      blob,
      videoUrl,
      questionIndex: this.state.currentQuestionIndex
    };

    // Don't save/download the video yet - wait for user confirmation
    console.log('Recording ready for confirmation:', questions[this.state.currentQuestionIndex].text);
    console.log('Video URL:', videoUrl);
    console.log('User:', this.state.userInfo);

    // Show confirmation modal instead of automatically moving to next question
    this.updateConfirmationModal();
    this.showModal('recordingConfirmationModal');
  }

  private showModal(modalId: string): void {
    const modal = this.elements[modalId];
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('hs-overlay-open:opacity-100');
    }
  }

  private hideModal(modalId: string): void {
    const modal = this.elements[modalId];
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('hs-overlay-open:opacity-100');
    }
  }

  private showElement(elementId: string): void {
    const element = this.elements[elementId];
    if (element) {
      if (elementId === 'recordingIndicator') {
        element.classList.remove('opacity-0');
        element.classList.add('opacity-100');
      } else {
        element.classList.remove('hidden');
      }
    }
  }

  private hideElement(elementId: string): void {
    const element = this.elements[elementId];
    if (element) {
      if (elementId === 'recordingIndicator') {
        element.classList.remove('opacity-100');
        element.classList.add('opacity-0');
      } else {
        element.classList.add('hidden');
      }
    }
  }

  private cleanup(): void {
    this.stopCamera();
    if (this.state.mediaRecorder && this.state.mediaRecorder.state === 'recording') {
      this.state.mediaRecorder.stop();
    }
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    if (this.preRecordingCountdownTimer) {
      clearInterval(this.preRecordingCountdownTimer);
      this.preRecordingCountdownTimer = null;
    }
  }
}