export function createAppHTML(): string {
  return `
    <!-- User Info Modal -->
    <div id="userInfoModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 p-4">
        <div class="w-full max-w-lg mx-auto">
            <!-- Form Card -->
            <div class="relative bg-white w-full rounded-xl border border-gray-200 pt-10 p-6">
                <!-- Pill-shaped header positioned on top border -->
                <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div class="bg-white px-4 border border-gray-200 rounded-full py-1 whitespace-nowrap">
                        <span class="text-sm text-gray-600">Capture reviews with </span><span class="text-sm text-blue-600 font-semibold">Feedspace ⚡</span>
                    </div>
                </div>
            <div class="flex items-center justify-center mb-4 sm:mb-6">
                    <img 
                        src="https://static.feedspace.io/uploads/1Ey7d0/allinone-feed-form/1752662334_techuplogo_bold_transparent.png" 
                        alt="TechUp Labs Logo" 
                        class="h-8 sm:h-10 w-auto mr-2 sm:mr-3"
                    >
                </div>    
            <div class="text-center mb-4 sm:mb-6">
                    <h2 class="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">Tell Us About Yourself</h2>
                    <p class="text-gray-600 font-normal text-sm sm:text-base">Your details will help us understand more about our users.</p>
                </div>
                

                <form id="userInfoForm" class="space-y-4 sm:space-y-6">
                    <div>
                        <label for="userName" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input 
                            type="text" 
                            id="userName" 
                            required 
                            placeholder="Eg. Henry Ford"
                            class="w-full h-12 sm:h-[38px] px-3 sm:px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        >
                    </div>
                    
                    <div class="">
                        <label for="userEmail" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            id="userEmail" 
                            required 
                            placeholder="Eg. henry@ford.com"
                            class="w-full h-12 sm:h-[38px] px-3 sm:px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        >
                    </div>

                    <div class="flex items-start space-x-3 pt-2">
                        <input 
                            type="checkbox" 
                            id="permissionCheckbox" 
                            required
                            class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        >
                        <label for="permissionCheckbox" class="text-sm text-gray-600 leading-relaxed">
                            I hereby grant permission to share this review with others.
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        class="w-full bg-gray-900 text-white py-3 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm sm:text-base"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Main App -->
    <div id="appContainer" class="hidden">
        <div class="w-full h-screen flex flex-col overflow-hidden" style="height: 100vh; height: 100dvh;">
            <!-- Video Container with Full Height -->
            <div class="relative w-full h-full flex flex-col overflow-hidden">
                <video id="videoElement" autoplay muted playsinline webkit-playsinline class="w-full h-full object-cover"></video>

                <!-- Countdown Overlay -->
                <div id="countdownOverlay" class="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm hidden">
                    <div class="text-center">
                        <div id="countdownNumber" class="text-6xl sm:text-8xl font-bold text-white mb-3 sm:mb-4">3</div>
                        <p class="text-lg sm:text-xl text-gray-300">Get ready...</p>
                    </div>
                </div>

                <!-- Question Overlay -->
                <div class="question-overlay absolute top-2 sm:top-4 left-2 right-2 sm:left-4 sm:right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-white">
                    <h3 class="font-semibold mb-2 text-blue-400 text-sm sm:text-base">Step <span id="currentStep">1</span> of <span id="totalSteps">3</span></h3>
                    <p id="currentQuestion" class="text-base sm:text-lg"></p>
                    <div id="notesSection" class="mt-3 sm:mt-4 bg-black/50 rounded-lg p-2 sm:p-3 hidden">
                        <textarea 
                            id="notesInput" 
                            placeholder="Enter your script or notes here..." 
                            class="w-full bg-transparent text-white placeholder-gray-300 resize-none border-none outline-none text-sm sm:text-base"
                            rows="2"
                        ></textarea>
                    </div>
                </div>

                <!-- Bottom Controls -->
                <div class="bottom-controls absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <!-- Timer above record button -->
                    <div class="flex justify-center mb-3 sm:mb-4">
                        <div id="recordingIndicator" class="flex items-center gap-2 text-white opacity-0">
                            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span id="recordingTimer" class="text-sm font-mono">00:00</span>
                        </div>
                    </div>
                    
                    <!-- Control buttons -->
                    <div class="flex justify-center gap-3 sm:gap-4 items-center">
                        <!-- Notes Button (Left) -->
                        <button id="notesButton" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-600/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gray-600/70 transition-colors">
                            <i data-feather="edit-3" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                        </button>

                        <!-- Record Button (Center) -->
                        <button id="recordButton" class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center text-white transition-colors shadow-lg">
                            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500"></div>
                        </button>

                        <!-- Camera Flip Button (Right) -->
                        <button id="flipCameraButton" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-600/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gray-600/70 transition-colors">
                            <i data-feather="rotate-cw" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Recording Confirmation Modal -->
    <div id="recordingConfirmationModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 hidden">
        <div class="bg-white rounded-2xl p-4 sm:p-6 mx-2 sm:mx-4 max-w-sm w-full text-center max-h-[90vh] overflow-y-auto">
            <!-- Step indicator -->
            <div class="flex items-center justify-center mb-3 sm:mb-4">
                <div class="w-1 h-4 sm:h-6 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
                <span class="text-xs sm:text-sm font-medium text-gray-600">Step <span id="confirmationStep">1</span> of <span id="confirmationTotalSteps">3</span></span>
            </div>
            
            <!-- Question text (faded) -->
            <p id="confirmationQuestion" class="text-sm sm:text-lg font-medium text-gray-400 mb-3 sm:mb-4">Tell us about yourself and your background.</p>
            
            <!-- Video Preview -->
            <div class="mb-3 sm:mb-4">
                <video id="recordingPreview" class="w-full h-32 sm:h-48 bg-gray-100 rounded-lg object-cover" controls>
                    Your browser does not support the video tag.
                </video>
            </div>
            
            <!-- Confirmation question -->
            <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Do you validate this video? ✌️</p>
            
            <!-- Action buttons -->
            <div class="flex justify-center gap-4 sm:gap-6">
                <button id="retryRecordingButton" class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <i data-feather="x" class="w-6 h-6 sm:w-8 sm:h-8 text-gray-600"></i>
                </button>
                <button id="confirmRecordingButton" class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <i data-feather="check" class="w-6 h-6 sm:w-8 sm:h-8 text-gray-600"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Submission Complete Modal -->
    <div id="completionModal" class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-100 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
            <div class="w-full flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div class="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
                    <h3 class="font-bold text-gray-800 dark:text-white">
                        Submission Complete!
                    </h3>
                </div>
                <div class="p-4 overflow-y-auto text-center">
                    <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-feather="check" class="text-white text-2xl"></i>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Thank you for participating in our video Q&A session.</p>
                    <div class="flex justify-center items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
                        <button id="restartButton" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                            <i data-feather="refresh-cw" class="w-4 h-4"></i>
                            Start New Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;
}