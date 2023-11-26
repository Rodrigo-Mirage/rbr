'use strict';

const {default: OBSWebSocket} = require('obs-websocket-js');


class obsMirage {
    constructor(nodecg){
        this.obs = new OBSWebSocket();

        this._ignoreConnectionClosedEvents = false;
        this._reconnectInterval = null;
        let namespace = 'obs';
        let connected = false;

        const websocketConfig = nodecg.Replicant(`${namespace}:websocket`);
        const programScene = nodecg.Replicant(`${namespace}:programScene`);
        const previewScene = nodecg.Replicant(`${namespace}:previewScene`);
        const sceneList = nodecg.Replicant(`${namespace}:sceneList`);
        const transitioning = nodecg.Replicant(`${namespace}:transitioning`);
        const studioMode = nodecg.Replicant(`${namespace}:studioMode`);
        const log = new nodecg.Logger(`${nodecg.bundleName}:${namespace}`);
        this.log = log;
        this.replicants = {
            websocket: websocketConfig,
            programScene,
            previewScene,
            sceneList,
            transitioning,
            studioMode
        };
        websocketConfig.once('change', newVal => {
            // If we were connected last time, try connecting again now.
            if (newVal.status === 'connected' || newVal.status === 'connecting') {
                websocketConfig.value.status = 'connecting';
                this._connectToOBS().then().catch(() => {
                    websocketConfig.value.status = 'error';
                });
            }
        });
        nodecg.listenFor(`${namespace}:connect`, (data, callback) => {
            this._ignoreConnectionClosedEvents = false;
            clearInterval(this._reconnectInterval);
            this._reconnectInterval = null;
            websocketConfig.value = {
                ip:data.ip,
                port:data.port,
                password:data.password
            }
            this._connectToOBS().then(() => {
                if (callback && !callback.handled) {
                    callback();
                }
            }).catch(err => {
                websocketConfig.value.status = 'error';
                if (!callback || callback.handled) {
                    return;
                }
                /* istanbul ignore else: this is just an overly-safe way of logging these critical errors */
                if (err.error && typeof err.error === 'string') {
                    callback(err.error);
                }
                else if (err.message) {
                    callback(err.message);
                }
                else if (err.code) {
                    callback(err.code);
                }
                else {
                    callback(err);
                }
            });
        });

        nodecg.listenFor(`${namespace}:disconnect`, (_data, callback) => {
            this._ignoreConnectionClosedEvents = true;
            clearInterval(this._reconnectInterval);
            this._reconnectInterval = null;
            websocketConfig.value.status = 'disconnected';
            this.obs.disconnect();
            this.log.info('Operator-requested disconnect.');
            if (callback && !callback.handled) {
                callback();
            }
        });
        nodecg.listenFor(`${namespace}:previewScene`, async (sceneName, callback) => {
            try {
                await this.obs.call('SetCurrentPreviewScene', { 'sceneName': sceneName });
                if (callback && !callback.handled) {
                    callback();
                }
            }
            catch (error) {
                this.log.error('Error setting preview scene:', error);
                if (callback && !callback.handled) {
                    callback(error);
                }
            }
        });
        nodecg.listenFor(`${namespace}:transition`, async ({ name, duration, sceneName } = {}, callback) => {
            if (studioMode.value) {
                // If in studio mode, set the preview scene, and then transition to it
                if (sceneName) {
                    try {
                        await this.obs.call('SetCurrentPreviewScene', { 'sceneName': sceneName });
                    }
                    catch (error) {
                        this.log.error('Error setting preview scene for transition:', error);
                        if (callback && !callback.handled) {
                            callback(error);
                        }
                        return;
                    }
                }
                try {
                    this.replicants.transitioning.value = true;
                    await this.obs.call('TriggerStudioModeTransition');
                }
                catch (error) {
                    this.log.error('Error transitioning:', error);
                    if (callback && !callback.handled) {
                        callback(error);
                    }
                    return;
                }
            }
            else {
                // If not in studio mode, set the transition params and then set the scene
                if (name) {
                    try {
                        await this.obs.call('SetCurrentSceneTransition', { "transitionName": name });
                    }
                    catch (error) {
                        this.log.error('Error setting current transition:', error);
                        if (callback && !callback.handled) {
                            callback(error);
                        }
                        return;
                    }
                }
                if (duration) {
                    try {
                        await this.obs.call('SetCurrentSceneTransitionDuration', { transitionDuration: duration });
                    }
                    catch (error) {
                        this.log.error('Error setting transition duration:', error);
                        if (callback && !callback.handled) {
                            callback(error);
                        }
                        return;
                    }
                }
                try {
                    // Mark that we're starting to transition. Resets to false after SwitchScenes.
                    this.replicants.transitioning.value = true;
                    await this.obs.call('TriggerStudioModeTransition');
                }
                catch (error) {
                    this.replicants.transitioning.value = false;
                    this.log.error('Error setting scene for transition:', error);
                    if (callback && !callback.handled) {
                        callback(error);
                    }
                    return;
                }
            }
            if (callback && !callback.handled) {
                callback();
            }
        });
        
        nodecg.listenFor(`${namespace}:startStreaming`, (_data, callback) => {
            try {
                this.obs.call('StartStreaming', {});
            }
            catch (error) {
                this.log.error('Error starting the streaming:', error);
                if (callback && !callback.handled) {
                    callback(error);
                }
                return;
            }
            if (callback && !callback.handled) {
                callback();
            }
        });
        nodecg.listenFor(`${namespace}:stopStreaming`, (_data, callback) => {
            try {
                this.obs.call('StopStreaming');
            }
            catch (error) {
                this.log.error('Error stopping the streaming:', error);
                if (callback && !callback.handled) {
                    callback(error);
                }
                return;
            }
            if (callback && !callback.handled) {
                callback();
            }
        });
        nodecg.listenFor(`${namespace}:sendMessage`, async(_data, callback) => {
            try {
                const websocketConfig = this.replicants.websocket;
                if (websocketConfig.value.status != 'connected') {
                    this.log.info('OBS not connected!');
                    return;
                }
                if(_data.data){
                    return this.obs.call(_data.messageName,_data.data).then( ret =>
                        {
                            callback(ret)
                        },error=>
                        {
                            this.log.info('sendMessage Message:', _data.data);
                            this.log.info('sendMessage Error:', error);
                        });
                }else{
                   return this.obs.call(_data.messageName).then( ret =>
                        {
                            callback(ret)
                        },error=>
                        {
                            this.log.info('sendMessage Error:', error);
                        });
                }

            }
            catch (error) {
                this.log.error('Error:', error);
                if (callback && !callback.handled) {
                    callback(error);
                }
                return;
            }
        });

        this.obs.on('error', (error) => {
            this.log.error(error);
            this._reconnectToOBS();
        });
        this.obs.on('ConnectionClosed', () => {
            this._reconnectToOBS();
        });
        setInterval(() => {
            if (websocketConfig.value && websocketConfig.value.status === 'connected' && !this.connected) {
                this.log.warn('Thought we were connected, but the automatic poll detected we were not. Correcting.');
                clearInterval(this._reconnectInterval);
                this._reconnectInterval = null;
                this._reconnectToOBS();
            }
        }, 1000);
    }
    obs
    replicants
    connected = false
    _ignoreConnectionClosedEvents = false;
    _reconnectInterval = null;
    /**
     * Attemps to connect to OBS Studio via obs-websocket using the parameters
     * defined in the ${namespace}:websocket Replicant.
     * @returns {Promise}
     */
    _connectToOBS() {
        const websocketConfig = this.replicants.websocket;
        if (websocketConfig.value.status === 'connected') {
            throw new Error('Attempted to connect to OBS while already connected!');
        }
        websocketConfig.value.status = 'connecting';

        return this.obs.connect(`ws://${websocketConfig.value.ip}:${websocketConfig.value.port}`, websocketConfig.value.password).then(() => {
            clearInterval(this._reconnectInterval);
            this._reconnectInterval = null;
            this.connected = true
            websocketConfig.value.status = 'connected';
            return this._fullUpdate();
        });
    }
    
    /**
     * Gets the current scene info from OBS, and detemines what layout is active based
     * on the sources present in that scene.
     * @returns {Promise}
     */
    _fullUpdate() {
        return this._updateStudioMode().then(()=>Promise.all([,
            this._updateScenesList(),
            this._updateProgramScene(),
            this._updatePreviewScene()
        ]));
    }

    /**
     * Attempt to reconnect to OBS, and keep re-trying every 5s until successful.
     * @private
     */
    _reconnectToOBS() {
        if (this._reconnectInterval) {
            return;
        }
        const websocketConfig = this.replicants.websocket;
        if (this._ignoreConnectionClosedEvents) {
            websocketConfig.value.status = 'disconnected';
            return;
        }
        websocketConfig.value.status = 'connecting';
        
        this.log.warn('Connection closed, will attempt to reconnect every 5 seconds.');
        this._reconnectInterval = setInterval(() => {
            this._connectToOBS().catch(/* istanbul ignore next */ () => { 
            }); // Intentionally discard error messages -- bit dangerous.
        }, 5000);
    }
    /**
     * Updates the sceneList replicant with the current value from OBS.
     * By extension, it also updates the customSceneList replicant.
     * @returns {Promise}
     */
    _updateScenesList() {
        return this.obs.call('GetSceneList').then(res => {
            this.replicants.sceneList.value = res.scenes.map(scene => scene.name);
            return res;
        }).catch(err => {
            this.log.error('Error updating scenes list:', err);
        });
    }
    /**
     * Updates the programScene replicant with the current value from OBS.
     * @returns {Promise}
     */
    _updateProgramScene() {
        return this.obs.call('GetCurrentProgramScene').then(res => {
            this.log.warn('GetCurrentProgramScene',res);
            // This conditional is required because of this bug:
            // https://github.com/Palakis/obs-websocket/issues/346
            if (res.name && res.sources) {
                this.replicants.programScene.value = {
                    name: res.name,
                    sources: res.sources
                };
            }
            return res;
        }).catch(err => {
            this.log.error('Error updating program scene:', err);
        });
    }
    /**
     * Updates the previewScene replicant with the current value from OBS.
     */
    _updatePreviewScene() {
        return this.obs.call('GetCurrentPreviewScene').then(res => {
            this.log.warn('GetCurrentPreviewScene',res);
            // This conditional is required because of this bug:
            // https://github.com/Palakis/obs-websocket/issues/346
            if (res.name && res.sources) {
                this.replicants.previewScene.value = {
                    name: res.name,
                    sources: res.sources
                };
            }
        }).catch(err => {
            if (err.error === 'studio mode not enabled') {
                this.replicants.previewScene.value = null;
                return;
            }
            this.log.error('Error updating preview scene:', err);
        });
    }
    /**
     * Updates the studioMode replicant with the current value from OBS.
     * @returns {Promise.<T>|*}
     * @private
     */
    _updateStudioMode() {
        return this.obs.call('GetStudioModeEnabled').then(res => {
            this.log.warn('GetStudioModeEnabled',res);
            if(!res['studioModeEnabled']){
                this.obs.call('SetStudioModeEnabled',{studioModeEnabled:true}).then(()=>{
                    this.replicants.studioMode.value = true;
                }).catch(()=>{
                    this.replicants.studioMode.value = false;
                })
            }

        }).catch(err => {
            this.log.error('Error getting studio mode status:', err);
        });
    }
    /**
     * Transitions from preview to program with the desired transition.
     * Has an optional hook for overriding which transition is used.
     * @param [transitionName] - The name of the transition to use.
     * If not provided, will use whatever default transition is selected in this.
     * The transition choice can be overridden by a user code hook.
     * @param [transitionDuration] - The duration of the transition to use.
     * If not provided, will use whatever default transition duration is selected in this.
     * The transition duration can be overridden by a user code hook.
     * @returns {Promise}
     */
    async _transition(transitionName, transitionDuration) {
        if (this.replicants.websocket.value.status !== 'connected') {
            throw new Error('Can\'t transition when not connected to OBS');
        }
        const transitionConfig = {
            name: transitionName,
            duration: undefined
        };
        if (typeof transitionDuration === 'number') {
            transitionConfig.duration = transitionDuration;
        }
        let transitionOpts = {
            'with-transition': transitionConfig
        };
        // Mark that we're starting to transition. Resets to false after SwitchScenes.
        this.replicants.transitioning.value = true;


    }
}

module.exports = obsMirage;