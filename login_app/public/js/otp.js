// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC3MIN64hy_oTQfQWUHl0lID-CJkIfci0M",
    authDomain: "yt-project-a29f8.firebaseapp.com",
    projectId: "yt-project-a29f8",
    storageBucket: "yt-project-a29f8.appspot.com",
    messagingSenderId: "159898773748",
    appId: "1:159898773748:web:2985334de4f06ff73356a1",
    measurementId: "G-DLWR9M5SJC"
};
// Initialize Firebase and render Recaptcha
firebase.initializeApp(firebaseConfig);
render();

// Function to render Recaptcha
function render() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    recaptchaVerifier.render();
}

// Function for sending the OTP
function phoneAuth() {
    var number = document.getElementById('number').value;
    firebase.auth().signInWithPhoneNumber(number, window.recaptchaVerifier).then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
        coderesult = confirmationResult;
        document.getElementById('sender').style.display = 'none';
        document.getElementById('verifier').style.display = 'block';
    }).catch(function (error) {
        alert(error.message);
    });
}

// Function to handle phone number verification 
function codeverify() {
    var code = document.getElementById('verificationcode').value;
    coderesult.confirm(code).then(function () {
        document.getElementsByClassName('p-conf')[0].style.display = 'block';
        document.getElementsByClassName('n-conf')[0].style.display = 'none';

        // Redirect to the dashboard page upon successful verification
        window.location.href = '/dashboard'; // Replace with your dashboard URL
    }).catch(function () {
        document.getElementsByClassName('p-conf')[0].style.display = 'none';
        document.getElementsByClassName('n-conf')[0].style.display = 'block';
    });
}
