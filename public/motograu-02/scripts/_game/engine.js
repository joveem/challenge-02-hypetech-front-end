//#region GAME
class BaseGameScene extends Phaser.Scene
{
    constructor(params)
    {
        super(params);
    }

    async Delay(waitSeconds)
    {
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
    }

    //#region Screen
    GetOutScreenLeftPosition(baseObject)
    {
        let value = -1;

        if (baseObject != null)
            value = 0 - baseObject.width;

        return value;
    }

    GetOutScreenRightPosition(baseObject)
    {
        let value = -1;

        value = this.game.canvas.width;

        if (baseObject != null)
            value += baseObject.width;

        return value;
    }

    GetScreenMiddlePositionX()
    {
        let value = -1;

        value = this.GetScreenPositionXByFactor(0.5);

        return value;
    }

    GetScreenPositionXByFactor(factorValue)
    {
        let value = -1;

        value = this.game.canvas.width * factorValue;

        return value;
    }
    //#endregion Screen

    //#region Ease
    ValueToEaseOutQuart(initialValue, endValue, t)
    {
        let value = 0;

        let deltaValue = endValue - initialValue;
        let valueFactor = 0;

        valueFactor = 1 - Math.pow(1 - t, 4);
        value = deltaValue * valueFactor;

        return value;
    }

    ValueToEaseOutCirc(initialValue, endValue, t)
    {
        let value = 0;

        let deltaValue = endValue - initialValue;
        let valueFactor = 0;

        valueFactor = Math.sqrt(1 - Math.pow(1 - t, 1));
        value = deltaValue * valueFactor;

        return value;
    }

    ValueToEaseOutCubic(initialValue, endValue, t)
    {
        let value = 0;

        let deltaValue = endValue - initialValue;
        let valueFactor = 0;

        valueFactor = 1 - Math.pow(1 - t, 1);
        value = deltaValue * valueFactor;

        return value;
    }
    //#endregion Ease
}

class MotoGrauGameScene extends BaseGameScene
{
    constructor()
    {
        super();

        // sprite - images
        this.spriteKeys = {};
        this.spriteKeys.blackCoverKey = "reset-black-cover-01";
        this.spriteKeys.cityBackgroundKey = "cityscene-background-01";
        // sprite - atlases
        this.spriteAtlasKeys = {};
        this.spriteAtlasKeys.dogKey = "dog-sprite-atras-01";
        this.spriteAtlasKeys.driver01Key = "driver-sprite-atras-01";
        this.spriteAtlasKeys.driver02Key = "driver-sprite-atras-02";
        this.spriteAtlasKeys.driver03Key = "driver-sprite-atras-03";
        // audio - music
        this.musicKeys = {};
        this.musicKeys.MainThemeMusicKey = "main-theme-music";
        // audio - SFX
        this.soundFXKeys = {};
        this.soundFXKeys.AccelerationKey = "acceleration-sfx";
        this.soundFXKeys.AccelerationStartKey = "acceleration-start-sfx";
        this.soundFXKeys.CrashKey = "crash-sfx";
        this.soundFXKeys.DogBarkKey = "dog-bark-sfx";
        // audio - configs
        this.audioConfigsDictionary = {};
        this.audioConfigsDictionary[this.soundFXKeys.AccelerationKey] = { loop: false, volume: 0.5, }
        this.audioConfigsDictionary[this.soundFXKeys.AccelerationStartKey] = { loop: false, volume: 0.5, }
        this.audioConfigsDictionary[this.soundFXKeys.CrashKey] = { loop: false, volume: 5, }
        this.audioConfigsDictionary[this.soundFXKeys.DogBarkKey] = { loop: false, volume: 0.5, }
        // animation - frame rate
        this.animationsDefaultFrameRate = 18;
        // animation - keys
        this.animationKeys = {};
        this.animationKeys.DriverWheelieAccelerationKey = "driver-wheelie-acceleration";
        this.animationKeys.DriverWheelieStartKey = "driver-wheelie-start";
        this.animationKeys.DriverWheelieCycleKey = "driver-wheelie-cycle";
    }

    ResetScene()
    {
        if (this.mainThemeMusic == null)
        {
            this.mainThemeMusic =
                this.sound.add(
                    this.musicKeys.MainThemeMusicKey,
                    {
                        loop: true,
                        volume: 0.1,
                    });
        }

        this.mainThemeMusic.stop();
        this.mainThemeMusic.play();


        this.hasToReset = false;
        this.resetFadeFactor = 0;

        this.currentVelocityFactor = 1;
        this.hasStartedAcceleration = false;
        this.hasStartedDesceleration = false;
        this.hasAlreadyPlayedDogScareAnimation = false;

        let resetCoverImage = this.resetCoverImage;
        resetCoverImage.alpha = this.resetFadeFactor;

        this.moveCameraToRight = true;
        this.moveCameraDeltaFactor = 0;

        this.StartDriverInitialMovement();
        this.StartDogInitialMovement();
    }

    preload()
    {
        // this.load.setBaseURL('.');

        // sprites
        this.load.image(this.spriteKeys.blackCoverKey, './../motograu/src/assets/sprites/black.png');
        this.load.image(this.spriteKeys.cityBackgroundKey, './../motograu/src/assets/sprites/bg-day-02.png');
        // atlases
        this.load.atlas(this.spriteAtlasKeys.dogKey, './../motograu/src/assets/sprites/dog/dog.png', './../motograu/src/assets/sprites/dog/dog-02.json');
        this.load.atlas(this.spriteAtlasKeys.driver01Key, './../motograu/src/assets/sprites/Motociclista/Entrada/Entrada-1.png', './../motograu/src/assets/sprites/Motociclista/Entrada/Entrada-02.json');
        this.load.atlas(this.spriteAtlasKeys.driver02Key, './../motograu/src/assets/sprites/Motociclista/Grau/Grau-1.png', './../motograu/src/assets/sprites/Motociclista/Grau/Grau-02.json');
        this.load.atlas(this.spriteAtlasKeys.driver03Key, './../motograu/src/assets/sprites/Motociclista/Crash/Crash.png', './../motograu/src/assets/sprites/Motociclista/Crash/Crash-02.json');
        // audio - music
        this.load.audio(this.musicKeys.MainThemeMusicKey, './../motograu/src/assets/audio/musicGame.mp3')
        // audio - SFX
        this.load.audio(this.soundFXKeys.AccelerationKey, './../motograu/src/assets/audio/driver-acceleration-sfx.mp3')
        this.load.audio(this.soundFXKeys.AccelerationStartKey, './../motograu/src/assets/audio/driver-acceleration-start-sfx.mp3')
        this.load.audio(this.soundFXKeys.CrashKey, './../motograu/src/assets/audio/crashingMoto.mp3')
        this.load.audio(this.soundFXKeys.DogBarkKey, './../motograu/src/assets/audio/dogSound.mp3')
    }

    create()
    {
        // this.add.image(400, 300, 'sky');

        // const particles = this.add.particles(0, 0, 'red', {
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        // const logo = this.physics.add.image(400, 100, 'logo');

        // logo.setVelocity(100, 200);
        // logo.setBounce(1, 1);
        // logo.setCollideWorldBounds(true);

        // particles.startFollow(logo);

        // this.sprite = this.add.sprite(250, 250, this.spriteAtlasKeys.dogKey);
        // let dogSprite = this.add.sprite(250, 250, this.spriteAtlasKeys.dogKey);

        // this.anims.create({
        //     key: 'nome_animacao',
        //     frames: this.anims.generateFrameNames(this.spriteAtlasKeys.dogKey, { prefix: 'cachorro-ciclo-A', start: 0, end: 5, zeroPad: 4 }),
        //     frameRate: 10,
        //     repeat: -1// -1 para repetição infinita, ou um número para um número específico de repetições,
        // });

        // ! //////////////////////

        this.InstantiateBackground();

        let dogInstance = this.InstatiateDog(this);
        let driverInstance = this.InstatiateDriver(this);
        this.TryToPlayAnimation(dogInstance, 'cachorro-ciclo-A');
        this.TryToPlayAnimation(driverInstance, 'driver-idle-01');

        let resetCoverImage = this.add.sprite(250, 250, this.spriteKeys.blackCoverKey);
        resetCoverImage.setScale(50, 50);

        this.resetCoverImage = resetCoverImage;

        this.dogInstance = dogInstance;
        this.driverInstance = driverInstance;

        this.sound.pauseOnBlur = false;
        this.sound.mute = false;
        this.sound.setMute(false);
        this.sound.resumeAll();

        this.scene.run("game-ui-scene");
        this.ResetScene();
    }

    InstantiateBackground()
    {
        // ############# BACKGROUND

        let cityBackgroundSpritesList = [];

        let backgroundsAmounts = 5;
        let backgroundHeight = 1080;
        let backgroundWidth = 1920;
        let backgroundMinPosition = 1920 / 2 - 1920;
        let currentPosition = backgroundMinPosition;

        for (let i = 0; i < backgroundsAmounts; i++)
        {
            let cityBackgroundSpriteInstance = this.add.sprite(currentPosition, backgroundHeight / 2, this.spriteKeys.cityBackgroundKey);
            cityBackgroundSpritesList.push(cityBackgroundSpriteInstance);

            currentPosition += backgroundWidth;
        }

        this.cityBackgroundSpritesList = cityBackgroundSpritesList;
        this.backgroundsAmounts = backgroundsAmounts;
        this.backgroundHeight = backgroundHeight;
        this.backgroundWidth = backgroundWidth;
        this.backgroundMinPosition = backgroundMinPosition;

        // let cityBackgroundSprite01 = this.add.sprite(1920 / 2, 1080 / 2, this.spriteKeys.cityBackgroundKey);
        // let cityBackgroundSprite02 = this.add.sprite(1920 / 2 + 1920, 1080 / 2, this.spriteKeys.cityBackgroundKey);
        // let cityBackgroundSprite03 = this.add.sprite(1920 / 2 - 1920, 1080 / 2, this.spriteKeys.cityBackgroundKey);

        // this.cityBackgroundSprite01 = cityBackgroundSprite01;
        // this.cityBackgroundSprite02 = cityBackgroundSprite02;
        // this.cityBackgroundSprite03 = cityBackgroundSprite03;
        // ############# BACKGROUND
    }

    update(time, delta)
    {
        this.HandleAcceleration(time, delta);
        this.HandleDesceleration(time, delta);

        this.HandleResetFade(time, delta);

        this.HandleCameraZoom(time, delta);
        this.HandleCameraMovement(time, delta);
        this.HandleBackgroundMovement(time, delta);

        this.HandleDogCrashMovement(time, delta);
        // this.HandleDriverMovement(time, delta);
    }

    HandleDogCrashMovement(time, delta)
    {
        if (this.hasStartedDesceleration)
        {
            if (this.dogTween != null)
                this.dogTween.stop();

            let deltaTime = (delta / 1000);

            let currentVelocityFactor = this.currentVelocityFactor;
            let defaultBackgroundVelocity = 1000;
            let dogSpeedMultiplier = 2.5;

            if (currentVelocityFactor > 1)
                currentVelocityFactor = 1;

            this.dogInstance.x +=
                (1 - currentVelocityFactor) *
                defaultBackgroundVelocity *
                dogSpeedMultiplier *
                deltaTime;


            if (!this.hasAlreadyPlayedDogScareAnimation &&
                this.dogInstance.x >= this.GetScreenMiddlePositionX() - 350)
            {
                this.hasAlreadyPlayedDogScareAnimation = true;
                // play scare animation AND audio
                this.PlaySFX(this.soundFXKeys.DogBarkKey);
                this.TryToPlayAnimation(this.dogInstance, 'cachorro-transicao-susto');
            }
        }
    }

    HandleDriverMovement(time, delta)
    {
        let deltaTime = (delta / 1000);

        let driverMovementVelocity = 50;

        let driverInstance = this.driverInstance;
        let destinationXPosition = this.destinationXPosition;
        let destinationDistance = driverInstance.x - destinationXPosition;

        if (Math.abs(destinationDistance) > 1)
        {
            if (destinationXPosition > driverInstance.x)
                driverInstance.x += driverMovementVelocity * deltaTime;
            else
                driverInstance.x -= driverMovementVelocity * deltaTime;
        } else
        {
            let randomPosition = Math.random() * 50;
            randomPosition += 225;

            this.destinationXPosition = randomPosition;
        }
    }

    HandleResetFade(time, delta)
    {
        if (this.hasToReset)
        {
            let deltaTime = (delta / 1000);

            let resetCoverImage = this.resetCoverImage;

            let fadeDurationSeconds = 2;

            this.resetFadeFactor += deltaTime * (1 / fadeDurationSeconds);
            resetCoverImage.alpha = this.resetFadeFactor;

            if (this.resetFadeFactor >= 1)
                this.ResetScene();
        }
    }

    StartReset()
    {
        this.hasToReset = true;
        this.resetFadeFactor = 0;
    }

    DoStartAcceleration()
    {
        console.log("> DoStartAcceleration");

        if (!this.hasStartedAcceleration)
        {
            this.hasStartedAcceleration = true;
            this.hasStartedDesceleration = false;

            this.TryStopSFX(this.accelerationSfx);
            this.accelerationSfx = this.PlaySFX(this.soundFXKeys.AccelerationKey);

            this.PlayDriverWheelieAccelerationAnimation();
            this.StartDogLeftMovement();
        }
    }

    PlayDriverWheelieAccelerationAnimation()
    {
        this.TryToPlayAnimation(
            this.driverInstance,
            this.animationKeys.DriverWheelieAccelerationKey,
            (animation, frame) => this.OnDriverWheelieAccelerationAnimationEnded(animation, frame));
    }

    OnDriverWheelieAccelerationAnimationEnded(animation, frame)
    {
        let isFromAcceleration = (animation.key == this.animationKeys.DriverWheelieAccelerationKey);

        console.log("isFromAcceleration = " + isFromAcceleration);
        if (isFromAcceleration)
            this.PlayDriverWheelieStartAnimation();
    }

    PlayDriverWheelieStartAnimation()
    {
        this.TryToPlayAnimation(
            this.driverInstance,
            this.animationKeys.DriverWheelieStartKey,
            (animation, frame) => this.OnDriverWheelieStartAnimationEnded(animation, frame));
    }

    OnDriverWheelieStartAnimationEnded(animation, frame)
    {
        let isFromWheelieStart = (animation.key == this.animationKeys.DriverWheelieStartKey);

        console.log("isFromWheelieStart = " + isFromWheelieStart);
        if (isFromWheelieStart)
        {
            this.TryToPlayAnimation(
                this.driverInstance,
                this.animationKeys.DriverWheelieCycleKey);
        }
    }

    // PlayDriverWheelieStartAnimation()
    // {
    //     this.TryToPlayAnimation(
    //         this.driverInstance,
    //         this.animationKeys.DriverWheelieAccelerationKey,
    //         (animation, frame) => this.OnDriverWheelieAccelerationAnimationEnded(animation, frame));
    // }

    TryToPlayAnimation(target, animationName, onAnimationFinishOnceCallback = null)
    {
        if (target != null)
        {
            target.play(animationName);

            if (onAnimationFinishOnceCallback != null)
            {
                target.once(
                    Phaser.Animations.Events.ANIMATION_COMPLETE,
                    onAnimationFinishOnceCallback);
            }
        }
    }

    TryToPlayReverseAnimation(target, animationName, onAnimationFinishOnceCallback = null)
    {
        if (target != null)
        {
            target.playReverse(animationName);

            if (onAnimationFinishOnceCallback != null)
            {
                target.once(
                    Phaser.Animations.Events.ANIMATION_COMPLETE,
                    onAnimationFinishOnceCallback);
            }
        }
    }

    TryToStopTween(targetTween)
    {
        if (targetTween != null)
            targetTween.stop();
    }

    StartDogLeftMovement()
    {
        this.TryToStopTween(this.dogTween);
        this.TryToPlayAnimation(this.dogInstance, 'cachorro-ciclo-A');

        let tweenDurationSeconds = 2;
        let finalPosition = this.GetOutScreenLeftPosition(this.dogInstance);

        let tweenConfit =
        {
            targets: this.dogInstance,
            x: { value: finalPosition, ease: 'sine.inout' },
            duration: tweenDurationSeconds * 1000,
            // onComplete: () => this.StartDriverRandomMovement()
        }

        this.dogTween = this.tweens.add(tweenConfit);
    }

    StartDogRightMovement()
    {
        this.TryToPlayAnimation(this.dogInstance, 'cachorro-transicao-susto');

        if (this.dogTween != null)
            this.dogTween.stop();

        let tweenDurationSeconds = 2;
        let finalPosition = this.GetOutScreenRightPosition(this.dogInstance);
        finalPosition *= 2;

        let tweenConfit =
        {
            targets: this.dogInstance,
            x: { value: finalPosition, ease: 'linear' },
            duration: tweenDurationSeconds * 1000,
        }

        this.dogTween = this.tweens.add(tweenConfit);
    }

    StartDriverInitialMovement()
    {
        this.TryToPlayAnimation(this.driverInstance, 'driver-idle-01');
        this.driverInstance.x = this.GetOutScreenLeftPosition(this.driverInstance);

        let tweenDurationSeconds = 3;
        let destinationPositionX = this.GetScreenPositionXByFactor(0.5);

        let tweenConfit =
        {
            targets: this.driverInstance,
            x: { value: destinationPositionX, ease: 'circ.out' },
            duration: tweenDurationSeconds * 1000,
            onComplete: () => this.OnDriverInitialMovementEnded()
        }

        this.driverTween = this.tweens.add(tweenConfit);
    }

    OnDriverInitialMovementEnded()
    {
        if (!this.hasStartedAcceleration && !this.hasStartedDesceleration)
            this.TestWheelie();

        this.StartDriverRandomMovement();
    }

    async StartDogInitialMovement()
    {
        this.TryToPlayAnimation(this.dogInstance, 'cachorro-transicao-susto');
        this.dogInstance.x = this.GetOutScreenRightPosition(this.dogInstance);

        await this.Delay(3);

        if (this.dogTween != null)
            this.dogTween.stop();

        let centerPositionX = this.GetScreenPositionXByFactor(0.5);

        let tweenDurationSeconds = 5;
        let tweenConfit =
        {
            targets: this.dogInstance,
            x: { value: centerPositionX, ease: 'linear' },
            duration: tweenDurationSeconds * 1000,
            onComplete: () => this.StartDogFollowingMovement()
        }

        this.dogTween = this.tweens.add(tweenConfit);
    }

    async StartDogFollowingMovement(onFinishCallback = null)
    {
        this.TryToPlayAnimation(this.dogInstance, 'cachorro-ciclo-A');
        this.PlaySFX(this.soundFXKeys.DogBarkKey);

        if (this.dogTween != null)
            this.dogTween.stop();

        let centerPositionX = this.GetScreenPositionXByFactor(0.5);
        let destinationPositionX = centerPositionX - 300;

        let tweenDurationSeconds = 5;
        let tweenConfit =
        {
            targets: this.dogInstance,
            x: { value: destinationPositionX, ease: 'circ.out' },
            duration: tweenDurationSeconds * 1000,
            onComplete: () =>
            {
                if (onFinishCallback != null)
                    onFinishCallback();
            }
        }

        this.dogTween = this.tweens.add(tweenConfit);
    }

    StartCrashDriverCenteringMovement()
    {
        let tweenDurationSeconds = 1;

        let centerPositionX = this.GetScreenPositionXByFactor(0.5);
        let destinationPositionX = centerPositionX - 150;

        let tweenConfit =
        {
            targets: this.driverInstance,
            x: { value: destinationPositionX, ease: 'circ.out' },
            duration: tweenDurationSeconds * 1000,
        }

        this.tweens.add(tweenConfit);
    }

    StartCrashDogCenteringMovement()
    {
        this.TryToPlayAnimation(this.dogInstance, 'cachorro-ciclo-A');

        if (this.dogTween != null)
            this.dogTween.stop();

        let centerPositionX = this.GetScreenPositionXByFactor(0.5);

        let tweenDurationSeconds = 2;
        let tweenConfit =
        {
            targets: this.dogInstance,
            x: { value: centerPositionX, ease: 'linear' },
            duration: tweenDurationSeconds * 1000,
            onComplete: () => this.StartDogRightMovement()
        }

        this.dogTween = this.tweens.add(tweenConfit);
    }

    StartDriverRandomMovement()
    {
        let tweenDurationSeconds = 2;

        let randomPosition = Math.random() * 25;
        randomPosition += 25;

        let centerPositionX = this.GetScreenPositionXByFactor(0.5);

        if (this.destinationXPosition <= centerPositionX)
            randomPosition += centerPositionX;
        else
            randomPosition += centerPositionX;

        this.destinationXPosition = randomPosition;

        let tweenConfit =
        {
            targets: this.driverInstance,
            x: { value: randomPosition, ease: 'sine.inout' },
            duration: tweenDurationSeconds * 1000,
            onComplete: () => this.StartDriverRandomMovement()
        }

        this.driverTween = this.tweens.add(tweenConfit);
    }

    async DoCrash()
    {
        console.log("> DoCrash");
        this.hasStartedDesceleration = true;
        this.hasStartedAcceleration = false;

        this.TryStopSFX(this.accelerationSfx);
        this.PlaySFX(this.soundFXKeys.CrashKey);

        this.TryToPlayAnimation(this.driverInstance, 'driver-crash-01');

        if (this.driverTween != null)
            this.driverTween.stop();
        this.StartCrashDriverCenteringMovement()
        // this.StartCrashDogCenteringMovement();

        await this.Delay(0.5);
        this.TryToPlayAnimation(this.driverInstance, 'driver-crash-slide-01');

        await this.Delay(0.5);
        // this.TryToPlayAnimation(this.dogInstance, 'cachorro-transicao-susto');

        await this.Delay(1.5);
        this.TryToPlayAnimation(this.driverInstance, 'driver-crash-idle-01');

        // baseScene.anims.create({ key: 'driver-crash-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver03Key, { prefix: 'motociclista-crash-transicao-A-', start: 1, end: 13, zeroPad: 4 }), repeat: 0 });
        // baseScene.anims.create({ key: 'driver-crash-slide-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver03Key, { prefix: 'motociclista-crash-ciclo-', start: 14, end: 16, zeroPad: 4 }), repeat: -1 });
        // baseScene.anims.create({ key: 'driver-crash-idle-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver03Key, { prefix: 'motociclista-crash-transicao-B-', start: 17, end: 21, zeroPad: 4 }), repeat: 0 });


        await this.Delay(2.5);
        this.StartReset();
    }

    HandleAcceleration(time, delta)
    {
        let canAccelerate =
            this.hasStartedAcceleration &&
            !this.hasStartedDesceleration

        if (canAccelerate)
        {
            let deltaTime = (delta / 1000);
            this.currentVelocityFactor += deltaTime;
        }
    }

    HandleDesceleration(time, delta)
    {
        if (this.hasStartedDesceleration)
        {
            let deltaTime = (delta / 1000);
            this.currentVelocityFactor -= this.currentVelocityFactor * deltaTime * 1;

            if (this.currentVelocityFactor < 0)
                this.currentVelocityFactor = 0;
        }
    }

    HandleCameraZoom(time, delta)
    {
        let adicionalCameraFactor = this.currentVelocityFactor - 1;
        adicionalCameraFactor = adicionalCameraFactor / 6.5;

        if (adicionalCameraFactor > 1)
            adicionalCameraFactor = 1;

        let finalCameraZoom = 1 - (adicionalCameraFactor * 0.6)
        this.cameras.main.zoom = finalCameraZoom;
    }

    HandleCameraMovement(time, delta)
    {
        let deltaTime = (delta / 1000);

        let maxVelocity = 5;
        let currentVelocityFactor = this.currentVelocityFactor + 0.5;

        if (currentVelocityFactor > maxVelocity)
            currentVelocityFactor = maxVelocity;

        let currentCameraPositionDelta = currentVelocityFactor / 20;

        let cameraMoveFactorIncrease = 40 * currentCameraPositionDelta;

        if (this.moveCameraToRight)
        {
            this.moveCameraDeltaFactor += cameraMoveFactorIncrease * deltaTime;

            if (this.moveCameraDeltaFactor >= 1)
                this.moveCameraToRight = false;
        } else
        {
            this.moveCameraDeltaFactor -= cameraMoveFactorIncrease * deltaTime;

            if (this.moveCameraDeltaFactor <= -1)
                this.moveCameraToRight = true;
        }

        let maxCameraPositionDelta = 150;

        let easeT = this.moveCameraDeltaFactor;

        if (easeT < 0)
            easeT *= -1;

        let easeFactor = this.ValueToEaseOutCirc(0, 1, easeT);

        if (this.moveCameraDeltaFactor < 0)
            easeFactor *= -1;

        this.cameras.main.centerOnY(250 + (currentCameraPositionDelta * maxCameraPositionDelta * easeFactor));
    }

    HandleBackgroundMovement(time, delta)
    {
        let deltaTime = (delta / 1000);
        let currentVelocityFactor = this.currentVelocityFactor;
        let defaultBackgroundVelocity = 1000;

        if (currentVelocityFactor > 20)
            currentVelocityFactor = 20;

        // console.log("currentVelocityFactor = " + currentVelocityFactor);
        // console.log("deltaTime = " + deltaTime);

        // ############# BACKGROUND
        let cityBackgroundSpritesList = this.cityBackgroundSpritesList;
        let backgroundsAmounts = this.backgroundsAmounts;
        let backgroundHeight = this.backgroundHeight;
        let backgroundWidth = this.backgroundWidth;
        let backgroundMinPosition = this.backgroundMinPosition;

        for (let i = 0; i < backgroundsAmounts; i++)
        {
            let cityBackgroundSprite = cityBackgroundSpritesList[i];

            cityBackgroundSprite.x -= defaultBackgroundVelocity * currentVelocityFactor * deltaTime;

            if (cityBackgroundSprite.x < backgroundMinPosition - backgroundWidth)
                cityBackgroundSprite.x += backgroundWidth * backgroundsAmounts;
        }
        // #############################

        // let cityBackgroundSprite01 = this.cityBackgroundSprite01;
        // let cityBackgroundSprite02 = this.cityBackgroundSprite02;
        // let cityBackgroundSprite03 = this.cityBackgroundSprite03;

        // cityBackgroundSprite01.x -= defaultBackgroundVelocity * currentVelocityFactor * deltaTime;
        // cityBackgroundSprite02.x -= defaultBackgroundVelocity * currentVelocityFactor * deltaTime;
        // cityBackgroundSprite03.x -= defaultBackgroundVelocity * currentVelocityFactor * deltaTime;

        // if (cityBackgroundSprite01.x < -1920)
        //     cityBackgroundSprite01.x += 1920 * 3;

        // if (cityBackgroundSprite02.x < -1920)
        //     cityBackgroundSprite02.x += 1920 * 3;

        // if (cityBackgroundSprite03.x < -1920 / 2)
        //     cityBackgroundSprite03.x += 1920 * 3;
    }

    InstatiateDriver(baseScene)
    {
        let instance = null;

        // baseScene.anims.create({ key: 'driver-start-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver01Key, { prefix: 'motociclista-entrada-', start: 1, end: 7, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });
        baseScene.anims.create({ key: 'driver-start-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver01Key, { prefix: 'motociclista-entrada-', start: 5, end: 7, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });
        // baseScene.anims.create({ key: 'driver-near-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver01Key, { prefix: 'motociclista-proxima-ao-ponto-de-fuga-ciclo-', start: 8, end: 11, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });
        baseScene.anims.create({ key: 'driver-near-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver01Key, { prefix: 'motociclista-proxima-ao-ponto-de-fuga-ciclo-', start: 9, end: 11, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });
        baseScene.anims.create({ key: 'driver-idle-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver01Key, { prefix: 'motociclista-distante-do-ponto-de-fuga-ciclo-', start: 14, end: 17, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });

        baseScene.anims.create({ key: this.animationKeys.DriverWheelieAccelerationKey, frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver02Key, { prefix: 'motociclista-transicao-grau-A-', start: 1, end: 7, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: 0 });
        baseScene.anims.create({ key: this.animationKeys.DriverWheelieStartKey, frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver02Key, { prefix: 'motociclista-transicao-grau-B-', start: 1, end: 13, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: 0 });
        baseScene.anims.create({ key: this.animationKeys.DriverWheelieCycleKey, frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver02Key, { prefix: 'motociclista-grau-ciclo-', start: 14, end: 16, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });

        baseScene.anims.create({ key: 'driver-crash-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver03Key, { prefix: 'motociclista-crash-transicao-A-', start: 1, end: 13, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: 0 });
        baseScene.anims.create({ key: 'driver-crash-slide-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver03Key, { prefix: 'motociclista-crash-ciclo-', start: 14, end: 16, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });
        baseScene.anims.create({ key: 'driver-crash-idle-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver03Key, { prefix: 'motociclista-crash-transicao-B-', start: 17, end: 21, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: 0 });

        instance = baseScene.add.sprite(250, 250, this.spriteAtlasKeys.driver01Key);

        return instance;
    }

    InstatiateDog(baseScene)
    {
        let instance = null;

        baseScene.anims.create({ key: 'cachorro-ciclo-A', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.dogKey, { prefix: 'cachorro-ciclo-A-', start: 1, end: 7, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });
        baseScene.anims.create({ key: 'cachorro-transicao-susto', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.dogKey, { prefix: 'cachorro-transicao-susto-', start: 8, end: 16, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });
        baseScene.anims.create({ key: 'cachorro-ciclo-B', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.dogKey, { prefix: 'cachorro-ciclo-B-', start: 17, end: 22, zeroPad: 4 }), frameRate: this.animationsDefaultFrameRate, repeat: -1 });

        instance = baseScene.add.sprite(250, 250, this.spriteAtlasKeys.dogKey);

        return instance;
    }

    PlaySFX(soundKey)
    {
        let sfxInstance = null;

        let config = this.audioConfigsDictionary[soundKey];

        if (config !== undefined)
        {
            sfxInstance = this.sound.add(soundKey, config);
            sfxInstance.play();
        }
        else
        {
            console.log(
                "ERROR trying to PlaySFX | " +
                "soundKey NOT FOUND! | " +
                "soundKey " + soundKey);
        }

        return sfxInstance;
    }

    TryStopSFX(soundFX)
    {
        if (soundFX != null)
            soundFX.stop();
    }

    async TestWheelie()
    {
        let maxValue = 3;
        maxValue += 0.9999;
        let wheeliesAmount = Math.floor(Math.random() * maxValue);

        for (let i = 0; i < wheeliesAmount; i++)
        {
            // up!

            let playConfig = { key: this.animationKeys.DriverWheelieStartKey };
            let hasToSetInitialIndex =
                this.driverInstance.anims.currentAnim !== undefined &&
                this.driverInstance.anims.currentAnim.key == this.animationKeys.DriverWheelieStartKey &&
                this.driverInstance.anims.currentFrame !== undefined &&
                !this.driverInstance.anims.currentFrame.isLast;

            if (hasToSetInitialIndex)
                playConfig.startFrame = this.driverInstance.anims.currentFrame.index;

            this.driverInstance.play(playConfig);

            await this.Delay(0.1);

            this.TryStopSFX(this.accelerationSfx);
            this.accelerationSfx = this.PlaySFX(this.soundFXKeys.AccelerationStartKey);

            await this.Delay(0.35);
            // down!

            let playReverseConfig = { key: this.animationKeys.DriverWheelieStartKey };
            hasToSetInitialIndex =
                this.driverInstance.anims.currentAnim !== undefined &&
                this.driverInstance.anims.currentAnim.key == this.animationKeys.DriverWheelieStartKey &&
                this.driverInstance.anims.currentFrame !== undefined &&
                !this.driverInstance.anims.currentFrame.isLast;

            if (hasToSetInitialIndex)
                playReverseConfig.startFrame = this.driverInstance.anims.currentFrame.index;

            this.driverInstance.playReverse(playReverseConfig);

            let onFinishCallback = null;

            if (i == wheeliesAmount - 1)
            {
                onFinishCallback =
                    () => this.TryToPlayAnimation(
                        this.driverInstance,
                        'driver-idle-01');
            }

            this.TryToPlayReverseAnimation(
                this.driverInstance,
                playReverseConfig,
                onFinishCallback);

            if (i != wheeliesAmount - 1)
                await this.Delay(0.25);
        }
    }
}
//#endregion GAME

//#region UI
class MotoGrauUIScene extends BaseGameScene
{
    constructor()
    {
        super({ key: "game-ui-scene" });

        // sprite - images
        this.spriteKeys = {};
        this.spriteKeys.velocemeterBackgroundKey = "ui-velocemeter-01-background-sprite";
        this.spriteKeys.velocemeterColorKey = "ui-velocemeter-01-color-sprite";
        this.spriteKeys.velocemeterPointerKey = "ui-velocemeter-01-pointer-sprite";
        this.spriteKeys.velocemeterMaskKey = "ui-velocimeter-01-mask-sprite";
        this.spriteKeys.StartCountDownBackgroundKey = "ui-start-countdown-01-background-sprite";
        this.spriteKeys.StartCountDownColorKey = "ui-start-countdown-01-color-sprite";

        this.currentVelocityFactor = 1;
        this.moveCameraToRight = true;
        this.moveCameraDeltaFactor = 0;
        this.currentStartCountdownValue = 10;

        this.hasStartedDesceleration = false;
    }

    ResetScene()
    {
        // this.hasToReset = false;
        // this.resetFadeFactor = 0;

        this.currentVelocityFactor = 1;
        this.hasStartedAcceleration = false;
        this.hasStartedDesceleration = false;

        this.moveCameraToRight = true;
        this.moveCameraDeltaFactor = 0;
        this.currentStartCountdownValue = 10;

        this.HideVelocemeter();

        this.IsInitialized = true;
    }

    preload()
    {
        // this.load.setBaseURL('.');

        // sprites
        this.load.image(this.spriteKeys.velocemeterBackgroundKey, './../motograu/src/assets/sprites/UI/ui-velocimeter-02-01-sprite.png');
        this.load.image(this.spriteKeys.velocemeterColorKey, './../motograu/src/assets/sprites/UI/ui-velocimeter-02-02-sprite.png');
        this.load.image(this.spriteKeys.velocemeterPointerKey, './../motograu/src/assets/sprites/UI/ui-velocimeter-02-03-sprite.png');
        this.load.image(this.spriteKeys.velocemeterMaskKey, './../motograu/src/assets/sprites/UI/ui-velocimeter-02-mask-sprite.png');
        this.load.image(this.spriteKeys.StartCountDownBackgroundKey, './../motograu/src/assets/sprites/UI/ui-start-countdown-01-sprite.png');
        this.load.image(this.spriteKeys.StartCountDownColorKey, './../motograu/src/assets/sprites/UI/ui-start-countdown-02-sprite.png');

        this.load.bitmapFont('atari-smooth', 'https://raw.githubusercontent.com/phaserjs/examples/master/public/assets/fonts/bitmap/atari-smooth.png', 'https://raw.githubusercontent.com/phaserjs/examples/master/public/assets/fonts/bitmap/atari-smooth.xml');
    }

    create()
    {
        this.InstantiateVelocemeter();
        this.InstantiateStartCountDown();
        this.InstantiateDriverFellText();
        this.ResetScene();
    }

    InstantiateVelocemeter()
    {
        let screenMiddlePositionX = this.GetScreenMiddlePositionX();
        let velocimeterPositionX = screenMiddlePositionX + 90;
        let velocimeterPositionY = 80;
        // let velocimeterScale = 0.25;
        let velocimeterScale = 0.2;
        // let velocimeterBaseRotation = Math.PI * 0.15;
        let velocimeterBaseRotation = 0.4;


        let velocemeterBackgroundSprite = this.add.sprite(velocimeterPositionX, velocimeterPositionY , this.spriteKeys.velocemeterBackgroundKey);
        let velocemeterColorSprite = this.add.sprite(velocimeterPositionX, velocimeterPositionY , this.spriteKeys.velocemeterColorKey);
        let velocemeterPointerSprite = this.add.sprite(velocimeterPositionX, velocimeterPositionY , this.spriteKeys.velocemeterPointerKey);

        let velocemeterColorMaskSprite = this.add.bitmapMask(null, velocimeterPositionX, velocimeterPositionY , this.spriteKeys.velocemeterMaskKey);

        velocemeterColorSprite.setMask(velocemeterColorMaskSprite);

        velocemeterBackgroundSprite.scale = velocimeterScale;
        velocemeterColorSprite.scale = velocimeterScale;
        velocemeterPointerSprite.scale = velocimeterScale;

        velocemeterBackgroundSprite.rotation = velocimeterBaseRotation;
        velocemeterColorSprite.rotation = velocimeterBaseRotation;
        velocemeterPointerSprite.rotation = velocimeterBaseRotation;

        this.velocemeterBackgroundSprite = velocemeterBackgroundSprite;
        this.velocemeterColorSprite = velocemeterColorSprite;
        this.velocemeterPointerSprite = velocemeterPointerSprite;
        this.velocemeterColorMaskSprite = velocemeterColorMaskSprite;
        this.velocimeterBaseRotation = velocimeterBaseRotation;
        this.velocimeterScale = velocimeterScale;

        console.log("velocemeterColorMaskSprite = ");
        console.log(velocemeterColorMaskSprite);

        // text
        // this.graphics = this.add.graphics({ x: 0, y: 0, fillStyle: { color: 0xffffff, alpha: 0 } });
        // const text1 = this.add.bitmapText(0, 0, 'atari-smooth', 'Welcome!', 70);
        let textSize = 52;

        let velocimeterTextPositionX = velocimeterPositionX - 45;
        let velocimeterTextPositionY = velocimeterPositionY - 45;
        let textCharSpacing = -20;


        let velocimeterMultiplierText =
            this.add.bitmapText(
                velocimeterTextPositionX - 5,
                velocimeterTextPositionY - 5 + (textSize / 2),
                'atari-smooth',
                '1.00x',
                textSize);

        let velocimeterMultiplierTextShadow =
            this.add.bitmapText(
                velocimeterTextPositionX,
                velocimeterTextPositionY + (textSize / 2),
                'atari-smooth',
                '1.00x',
                textSize);

        velocimeterMultiplierText.setText();

        velocimeterMultiplierText.setOrigin(1);
        velocimeterMultiplierText.letterSpacing = textCharSpacing;
        velocimeterMultiplierText.rotation = - Math.PI * 0.15;

        velocimeterMultiplierTextShadow.setOrigin(1);
        velocimeterMultiplierTextShadow.letterSpacing = textCharSpacing;
        velocimeterMultiplierTextShadow.rotation = - Math.PI * 0.15;

        velocimeterMultiplierTextShadow.setTint(0x220055);

        this.velocimeterMultiplierText01 = velocimeterMultiplierText;
        this.velocimeterMultiplierText01Bounds = velocimeterMultiplierText.getTextBounds(true);

        this.velocimeterMultiplierText01Shadow = velocimeterMultiplierTextShadow;
        this.velocimeterMultiplierText01ShadowBounds = velocimeterMultiplierTextShadow.getTextBounds(true);


        let velocemeterContainer = this.add.container(0, 0);

        velocemeterContainer.add(velocimeterMultiplierTextShadow);
        velocemeterContainer.add(velocimeterMultiplierText);

        velocemeterContainer.add(velocemeterBackgroundSprite);
        velocemeterContainer.add(velocemeterColorSprite);
        velocemeterContainer.add(velocemeterPointerSprite);
        // velocemeterContainer.add(velocemeterColorMaskSprite);

        // velocemeterPointerSprite.setActive(false);

        this.velocemeterContainer = velocemeterContainer;
    }

    InstantiateStartCountDown()
    {
        let screenMiddlePositionX = this.GetScreenMiddlePositionX();
        let startCountDownPositionX = screenMiddlePositionX + 0;
        let startCountDownPositionY = 250;
        let startCountDownScale = 1;

        let velocemeterBackgroundSprite = this.add.sprite(startCountDownPositionX, startCountDownPositionY, this.spriteKeys.StartCountDownBackgroundKey);
        let velocemeterColorSprite = this.add.sprite(startCountDownPositionX, startCountDownPositionY, this.spriteKeys.StartCountDownColorKey);

        velocemeterBackgroundSprite.scale = startCountDownScale;
        velocemeterColorSprite.scale = startCountDownScale;

        let startCountdownColorMaskSprite = this.add.bitmapMask(null, startCountDownPositionX, startCountDownPositionY, this.spriteKeys.StartCountDownColorKey);

        velocemeterColorSprite.setMask(startCountdownColorMaskSprite);

        startCountdownColorMaskSprite.bitmapMask.x -= (startCountdownColorMaskSprite.bitmapMask.width / 2);

        // text
        let textSize = 18;

        // let startCountdownTextPositionX = startCountDownPositionX - (startCountdownColorMaskSprite.bitmapMask.width / 2) + 6;
        let startCountdownTextPositionX = startCountDownPositionX;
        let startCountdownTextPositionY = startCountDownPositionY - (startCountdownColorMaskSprite.bitmapMask.height) - textSize;
        let textCharSpacing = -20;

        let startCountdownText =
            this.add.bitmapText(
                startCountdownTextPositionX,
                startCountdownTextPositionY + (textSize / 2),
                'atari-smooth',
                'proxima rodada em 10',
                textSize);

        startCountdownText.letterSpacing = textCharSpacing;
        startCountdownText.setOrigin(0.5);

        let startCountDownContainer = this.add.container(0, 0);
        startCountDownContainer.add(velocemeterBackgroundSprite);
        startCountDownContainer.add(velocemeterColorSprite);
        startCountDownContainer.add(startCountdownText);

        this.startCountdownText = startCountdownText;
        this.startCountDownContainer = startCountDownContainer;
        this.startCountdownColorMaskSprite = startCountdownColorMaskSprite;
    }

    InstantiateDriverFellText()
    {
        let screenMiddlePositionX = this.GetScreenMiddlePositionX();
        let driverFellPositionX = screenMiddlePositionX + 30; // TODO: REVIEW THIS!
        let driverFellPositionY = 150;
        let driverFellScale = 1;

        // text
        let textSize = 32;

        let driverFellTextPositionX = driverFellPositionX;
        let driverFellTextPositionY = driverFellPositionY;
        let textCharSpacing = -20;

        let driverFellText =
            this.add.bitmapText(
                driverFellTextPositionX,
                driverFellTextPositionY + (textSize / 2),
                'atari-smooth',
                'O piloto caiu!',
                textSize);

        driverFellText.letterSpacing = textCharSpacing;
        driverFellText.setOrigin(0.5);

        let driverFellContainer = this.add.container(0, 0);
        driverFellContainer.add(driverFellText);

        driverFellContainer.setVisible(false);

        this.driverFellContainer = driverFellContainer;
    }

    update(time, delta)
    {
        this.HandleVelocemeterTextColor();
        this.HandleStartCountDown(time, delta);

        this.HandleCameraMovement(time, delta);
    }

    HandleVelocemeterTextColor()
    {
        if (this.velocimeterMultiplierText01 !== undefined)
        {
            if (!this.hasStartedDesceleration)
                this.velocimeterMultiplierText01.setTint(0xffffff);
            else
                this.velocimeterMultiplierText01.setTint(0xff0000);
        }
    }

    SetStartCountdownValue(startCountdownValue)
    {
        this.HideDriverFellWarning();
        this.ShowStartCountDown();
        this.destinationStartCountdownValue = startCountdownValue;

        let textValue = "proxima rodada em " + startCountdownValue;

        if (this.startCountdownText !== undefined)
            this.startCountdownText.setText(textValue);
    }

    ShowStartCountDown()
    {
        if (this.startCountDownContainer !== undefined)
            this.startCountDownContainer.setVisible(true);
    }

    HideStartCountDown()
    {
        if (this.startCountDownContainer !== undefined)
            this.startCountDownContainer.setVisible(false);
    }

    ShowDriverFellWarning()
    {
        if (this.driverFellContainer !== undefined)
            this.driverFellContainer.setVisible(true);
    }

    HideDriverFellWarning()
    {
        if (this.driverFellContainer !== undefined)
            this.driverFellContainer.setVisible(false);
    }

    HandleStartCountDown(time, delta)
    {
        let deltaTime = (delta / 1000);
        let velocity = this.currentStartCountdownValue - this.destinationStartCountdownValue;
        let screenMiddlePositionX = this.GetScreenMiddlePositionX();

        if (this.currentStartCountdownValue > this.destinationStartCountdownValue)
            this.currentStartCountdownValue -= velocity * deltaTime;

        if (this.currentStartCountdownValue < 0)
            this.currentStartCountdownValue = 0;

        let startCountDownValueFactor = this.currentStartCountdownValue / 10;
        let deltaPosition = - this.startCountdownColorMaskSprite.bitmapMask.width * (1 - startCountDownValueFactor);
        let finalPosistion = screenMiddlePositionX + deltaPosition;

        // console.log("#>>> this.destinationStartCountdownValue = " + this.destinationStartCountdownValue + " | this.currentStartCountdownValue = " + this.currentStartCountdownValue);
        // console.log("###>>> screenMiddlePositionX = " + screenMiddlePositionX + " | deltaPosition = " + deltaPosition + " | finalPosistion = " + finalPosistion);

        this.startCountdownColorMaskSprite.bitmapMask.x = finalPosistion;
    }

    ShowVelocemeter()
    {
        if (this.velocemeterContainer !== undefined)
            this.velocemeterContainer.setVisible(true);
    }

    HideVelocemeter()
    {
        this.velocemeterContainer.setVisible(false);
    }

    SetMultiplierValue(multiplierValue, isLastValue = false)
    {
        this.ShowVelocemeter();

        if (!this.hasStartedDesceleration || isLastValue)
            this.currentVelocityFactor = multiplierValue;

        this.ApplyMultiplierText(multiplierValue);
        this.SetVelocemeterPositionFactor(multiplierValue / 100);
    }

    ApplyMultiplierText(multiplierValue)
    {
        if (multiplierValue == null || multiplierValue < 1)
            multiplierValue = 1;

        let textValue = multiplierValue.toFixed(2) + "x";

        if (this.velocimeterMultiplierText01 !== undefined)
            this.velocimeterMultiplierText01.setText(textValue);
        if (this.velocimeterMultiplierText01Shadow !== undefined)
            this.velocimeterMultiplierText01Shadow.setText(textValue);
    }

    SetVelocemeterPositionFactor(positionFactor)
    {
        let easedValue = this.ValueToEaseOutCirc(0, 1, positionFactor)

        if (easedValue > 1)
            easedValue = 1;

        let finalRotation = 0.09 + (Math.PI * 0.92 * easedValue);

        if (this.velocemeterColorMaskSprite !== undefined)
            this.velocemeterColorMaskSprite.bitmapMask.rotation = this.velocimeterBaseRotation + finalRotation;
        if (this.velocemeterPointerSprite !== undefined)
            this.velocemeterPointerSprite.rotation = this.velocimeterBaseRotation + finalRotation;
    }

    HandleCameraMovement(time, delta)
    {
        let deltaTime = (delta / 1000);

        let maxVelocity = 3;
        let currentVelocityFactor = this.currentVelocityFactor;

        if (this.hasStartedDesceleration)
            currentVelocityFactor = 1;

        currentVelocityFactor += 0.5;

        if (currentVelocityFactor > maxVelocity)
            currentVelocityFactor = maxVelocity;

        let currentCameraPositionDelta = currentVelocityFactor / 20;


        let cameraMoveFactorIncrease = 40 * currentCameraPositionDelta;

        if (this.moveCameraToRight)
        {
            this.moveCameraDeltaFactor += cameraMoveFactorIncrease * deltaTime;

            if (this.moveCameraDeltaFactor >= 1)
                this.moveCameraToRight = false;
        } else
        {
            this.moveCameraDeltaFactor -= cameraMoveFactorIncrease * deltaTime;

            if (this.moveCameraDeltaFactor <= -1)
                this.moveCameraToRight = true;
        }

        let maxCameraPositionDelta = 150;

        let easeT = this.moveCameraDeltaFactor;

        if (easeT < 0)
            easeT *= -1;

        let easeFactor = this.ValueToEaseOutCirc(0, 1, easeT);

        if (this.moveCameraDeltaFactor < 0)
            easeFactor *= -1;

        let screenMiddlePositionX = this.GetScreenMiddlePositionX();
        this.cameras.main.centerOnX(screenMiddlePositionX + (currentCameraPositionDelta * maxCameraPositionDelta * easeFactor));

        if (!this.hasStartedDesceleration)
        {
            this.SetVelocemeterIconScale((easeFactor + 1) / 2);
            this.SetVelocemeterTextScale((easeFactor + 1) / 2);
        }
        else
        {
            this.SetVelocemeterIconScale(0.5);
            this.SetVelocemeterTextScale(0.5);
        }
    }

    SetVelocemeterIconScale(scaleFactor)
    {
        let velocimeterScale = this.velocimeterScale;
        let minScaleFactor = 0.9;
        let maxScaleFactor = 1.1;
        let scaleDelta = maxScaleFactor - minScaleFactor;

        scaleFactor *= -1;
        scaleFactor += 1;

        let finalScale = minScaleFactor + (scaleDelta * scaleFactor);

        this.velocemeterBackgroundSprite.scale = finalScale * velocimeterScale;
        this.velocemeterColorSprite.scale = finalScale * velocimeterScale;
        this.velocemeterPointerSprite.scale = finalScale * velocimeterScale;
    }

    SetVelocemeterTextScale(scaleFactor)
    {
        // let velocimeterScale = this.velocimeterScale;
        let minScaleFactor = 0.8;
        let maxScaleFactor = 1.2;
        let scaleDelta = maxScaleFactor - minScaleFactor;

        // scaleFactor *= -1;
        // scaleFactor += 1;

        let finalScale = minScaleFactor + (scaleDelta * scaleFactor);

        // this.velocemeterBackgroundSprite.scale = finalScale * velocimeterScale;
        // this.velocemeterColorSprite.scale = finalScale * velocimeterScale;
        this.velocimeterMultiplierText01.scale = finalScale;
        this.velocimeterMultiplierText01Shadow.scale = finalScale;
    }

    //#region events
    DoStartAcceleration()
    {
        console.log("> DoStartAcceleration");

        if (!this.hasStartedAcceleration)
        {
            this.hasStartedAcceleration = true;
            this.hasStartedDesceleration = false;

            // handle velocemeter
            this.ShowVelocemeter();
            this.SetMultiplierValue(1);
            // handle start countdown
            this.HideStartCountDown();
            this.destinationStartCountdownValue = 10;
            this.currentStartCountdownValue = 10;


            // this.TryStopSFX(this.accelerationSfx);
            // this.accelerationSfx = this.PlaySFX(this.soundFXKeys.AccelerationKey);

            // this.PlayDriverWheelieAccelerationAnimation();
            // this.StartDogLeftMovement();
        }
    }



    async DoCrash(lastMultiplierValue)
    {
        console.log("> DoCrash");
        this.hasStartedDesceleration = true;
        this.hasStartedAcceleration = false;

        this.SetMultiplierValue(lastMultiplierValue, true);

        this.ShowDriverFellWarning();

        // this.TryStopSFX(this.accelerationSfx);
        // this.PlaySFX(this.soundFXKeys.CrashKey);

        // this.TryToPlayAnimation(this.driverInstance, 'driver-crash-01');

        // if (this.driverTween != null)
        //     this.driverTween.stop();
        // this.StartCrashDriverCenteringMovement()
        // // this.StartCrashDogCenteringMovement();

        await this.Delay(0.5);
        // this.TryToPlayAnimation(this.driverInstance, 'driver-crash-slide-01');

        await this.Delay(0.5);
        // // this.TryToPlayAnimation(this.dogInstance, 'cachorro-transicao-susto');

        await this.Delay(1.5);
        // this.TryToPlayAnimation(this.driverInstance, 'driver-crash-idle-01');

        // // baseScene.anims.create({ key: 'driver-crash-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver03Key, { prefix: 'motociclista-crash-transicao-A-', start: 1, end: 13, zeroPad: 4 }), repeat: 0 });
        // // baseScene.anims.create({ key: 'driver-crash-slide-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver03Key, { prefix: 'motociclista-crash-ciclo-', start: 14, end: 16, zeroPad: 4 }), repeat: -1 });
        // // baseScene.anims.create({ key: 'driver-crash-idle-01', frames: baseScene.anims.generateFrameNames(this.spriteAtlasKeys.driver03Key, { prefix: 'motociclista-crash-transicao-B-', start: 17, end: 21, zeroPad: 4 }), repeat: 0 });


        await this.Delay(2.5);
        this.HideVelocemeter();
    }
    //#endregion events
}
//#endregion UI

const config = {
    type: Phaser.AUTO,
    // width: 800,
    // height: 600,
    // width: 500,
    // height: 500,
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 2600,
        height: 500
    },
    scene: [MotoGrauGameScene, MotoGrauUIScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);

//#region EVENTS
addEventListener("start", OnStart);
addEventListener("crash", OnCrash);
addEventListener("test-wheelie", OnTestWheelie);
addEventListener("odds", OnUpdateMultiplier);
addEventListener("counterTime", OnStartCountDownUpdate);

// addEventListener("increaseOdd", DebugEvent); // ! TODO: REVIEW THIS!

function DebugEvent(event)
{
    console.log("#> DebugEvent ######");

    console.log("#> DebugEvent | name = " + event.type);
    console.log("#> DebugEvent | event.detail = ");
    console.log(event.detail);

    console.log("#> DebugEvent ######");
}

window.dispatchEvent(new CustomEvent("instance-created"))

window.focus();


function OnStart(event)
{
    // console.log("#> OnStart");
    // console.log(event.detail);

    let gameScene = game.scene.getAt(0);
    let uiScene = game.scene.getScene("game-ui-scene")


    if (gameScene != null)
        gameScene.DoStartAcceleration();
    if (uiScene != null && uiScene.IsInitialized)
        uiScene.DoStartAcceleration();
}

function OnStartCountDownUpdate(event)
{
    // console.log("#> OnStartCountDownUpdate");
    // console.log(event.detail);

    let uiScene = game.scene.getScene("game-ui-scene");
    if (uiScene != null && uiScene.IsInitialized)
        uiScene.SetStartCountdownValue(event.detail.timeOut);
}

function OnUpdateMultiplier(event)
{
    // console.log("#> OnUpdateMultiplier");
    // console.log(event.detail);

    let uiScene = game.scene.getScene("game-ui-scene");
    if (uiScene != null && uiScene.IsInitialized)
        uiScene.SetMultiplierValue(event.detail.multi);
}

function OnCrash(event)
{
    console.log("#> OnCrash");
    console.log(event.detail);

    let gameScene = game.scene.getAt(0);
    let uiScene = game.scene.getScene("game-ui-scene")

    gameScene.DoCrash();
    uiScene.DoCrash(event.detail.lastMultiplierValue);
}

function OnTestWheelie(event)
{
    // console.log("#> TestWheelie");

    let gameScene = game.scene.getAt(0);
    gameScene.TestWheelie();
}
//#endregion EVENTS
