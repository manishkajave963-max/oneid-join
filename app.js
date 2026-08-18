const APP_ID =
    "e75ad0cfd0d84495833a1d72fed7b7d9";


// =========================================================
// GET ROOM ID
// =========================================================

const params =
    new URLSearchParams(
        window.location.search
    );

const roomId =
    params.get("room") || "testRoom";


// =========================================================
// UI
// =========================================================

const joinScreen =
    document.getElementById(
        "joinScreen"
    );

const callScreen =
    document.getElementById(
        "callScreen"
    );

const nameInput =
    document.getElementById(
        "nameInput"
    );

const joinButton =
    document.getElementById(
        "joinButton"
    );

const joinStatus =
    document.getElementById(
        "joinStatus"
    );

const roomText =
    document.getElementById(
        "roomText"
    );

const connectedRoom =
    document.getElementById(
        "connectedRoom"
    );

const remoteVideo =
    document.getElementById(
        "remoteVideo"
    );

const localVideo =
    document.getElementById(
        "localVideo"
    );

const muteButton =
    document.getElementById(
        "muteButton"
    );

const cameraButton =
    document.getElementById(
        "cameraButton"
    );

const endButton =
    document.getElementById(
        "endButton"
    );


roomText.innerText =
    "Room: " + roomId;


// =========================================================
// AGORA
// =========================================================

let client = null;

let localAudioTrack = null;

let localVideoTrack = null;

let joined = false;

let muted = false;

let cameraOff = false;


// =========================================================
// JOIN
// =========================================================

joinButton.onclick =
    async function () {

        const name =
            nameInput.value.trim();

        if (!name) {

            joinStatus.innerText =
                "Please enter your name.";

            return;
        }


        try {

            joinStatus.innerText =
                "Joining meeting...";

            joinButton.disabled =
                true;


            client =
                AgoraRTC.createClient({
                    mode: "rtc",
                    codec: "vp8"
                });


            // =================================================
            // REMOTE USER PUBLISHED
            // =================================================

            client.on(
                "user-published",
                async (
                    user,
                    mediaType
                ) => {

                    await client.subscribe(
                        user,
                        mediaType
                    );


                    if (
                        mediaType ===
                        "video"
                    ) {

                        user.videoTrack.play(
                            remoteVideo
                        );
                    }


                    if (
                        mediaType ===
                        "audio"
                    ) {

                        user.audioTrack.play();
                    }
                }
            );


            // =================================================
            // REMOTE USER LEFT
            // =================================================

            client.on(
                "user-unpublished",
                (
                    user,
                    mediaType
                ) => {

                    if (
                        mediaType ===
                        "video"
                    ) {

                        remoteVideo.innerHTML =
                            "";
                    }
                }
            );


            // =================================================
            // JOIN CHANNEL
            // =================================================

            await client.join(
                APP_ID,
                roomId,
                null,
                null
            );


            // =================================================
            // CREATE CAMERA
            // =================================================

            localVideoTrack =
                await AgoraRTC.createCameraVideoTrack();


            // =================================================
            // CREATE MICROPHONE
            // =================================================

            localAudioTrack =
                await AgoraRTC.createMicrophoneAudioTrack();


            // =================================================
            // SHOW LOCAL
            // =================================================

            localVideoTrack.play(
                localVideo
            );


            // =================================================
            // PUBLISH
            // =================================================

            await client.publish(
                [
                    localVideoTrack,
                    localAudioTrack
                ]
            );


            joined = true;


            connectedRoom.innerText =
                "Room: " + roomId;


            joinScreen.classList.add(
                "hidden"
            );

            callScreen.classList.remove(
                "hidden"
            );


        } catch (error) {

            console.error(error);

            joinStatus.innerText =
                "Unable to join meeting.";

            joinButton.disabled =
                false;
        }
    };


// =========================================================
// MUTE
// =========================================================

muteButton.onclick =
    async function () {

        if (!localAudioTrack) {
            return;
        }

        muted = !muted;


        await localAudioTrack.setEnabled(
            !muted
        );


        muteButton.innerText =
            muted
                ? "🔇"
                : "🎤";
    };


// =========================================================
// CAMERA
// =========================================================

cameraButton.onclick =
    async function () {

        if (!localVideoTrack) {
            return;
        }

        cameraOff =
            !cameraOff;


        await localVideoTrack.setEnabled(
            !cameraOff
        );


        cameraButton.innerText =
            cameraOff
                ? "📷"
                : "📹";
    };


// =========================================================
// END CALL
// =========================================================

endButton.onclick =
    async function () {

        await leaveCall();

        window.location.reload();
    };


// =========================================================
// LEAVE
// =========================================================

async function leaveCall() {

    try {

        if (localAudioTrack) {

            localAudioTrack.stop();

            localAudioTrack.close();

            localAudioTrack = null;
        }


        if (localVideoTrack) {

            localVideoTrack.stop();

            localVideoTrack.close();

            localVideoTrack = null;
        }


        if (client && joined) {

            await client.leave();
        }


        joined = false;

    } catch (error) {

        console.error(error);
    }
}

let localIsMain = false;


localVideo.onclick =
    function () {

        makeLocalMain();
    };


remoteVideo.onclick =
    function () {

        makeRemoteMain();
    };


function makeLocalMain() {

    localIsMain = true;

    localVideo.style.position =
        "absolute";

    localVideo.style.left =
        "0";

    localVideo.style.top =
        "0";

    localVideo.style.right =
        "0";

    localVideo.style.bottom =
        "0";

    localVideo.style.width =
        "100%";

    localVideo.style.height =
        "100%";

    localVideo.style.borderRadius =
        "0";

    localVideo.style.zIndex =
        "1";


    remoteVideo.style.position =
        "absolute";

    remoteVideo.style.top =
        "20px";

    remoteVideo.style.right =
        "20px";

    remoteVideo.style.left =
        "auto";

    remoteVideo.style.bottom =
        "auto";

    remoteVideo.style.width =
        "120px";

    remoteVideo.style.height =
        "160px";

    remoteVideo.style.borderRadius =
        "12px";

    remoteVideo.style.zIndex =
        "10";
}


function makeRemoteMain() {

    localIsMain = false;

    remoteVideo.style.position =
        "absolute";

    remoteVideo.style.left =
        "0";

    remoteVideo.style.top =
        "0";

    remoteVideo.style.right =
        "0";

    remoteVideo.style.bottom =
        "0";

    remoteVideo.style.width =
        "100%";

    remoteVideo.style.height =
        "100%";

    remoteVideo.style.borderRadius =
        "0";

    remoteVideo.style.zIndex =
        "1";


    localVideo.style.position =
        "absolute";

    localVideo.style.top =
        "20px";

    localVideo.style.right =
        "20px";

    localVideo.style.left =
        "auto";

    localVideo.style.bottom =
        "auto";

    localVideo.style.width =
        "120px";

    localVideo.style.height =
        "160px";

    localVideo.style.borderRadius =
        "12px";

    localVideo.style.zIndex =
        "10";
}
