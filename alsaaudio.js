'use strict';
const AlsaCapture = require("alsa-capture");

const { RTCAudioSource } = require('wrtc').nonstandard;


class RTCAudioSourceAlsa {
  constructor(options = {}) {
    options = {
      frequency: 440,
      channelCount: 1,
      sampleRate: 48000,
      ...options
    };
  // default values for the options object

    const {
      device,
      channelCount,
      sampleRate
    } = options;
    
    const bitsPerSample = 16;
    const numberOfFrames = sampleRate / 100;
    const source = new RTCAudioSource();
    
    const captureInstance = new AlsaCapture({
        channels: channelCount,
        debug: false,
        device: device?device:"default",
        format: "S16_LE",
        periodSize: numberOfFrames,
        periodTime: undefined,
        rate: sampleRate,
       });

	 // data is an ArrayBuffer
	 // Buffer size = numChannels * formatByteSize * periodSize
	 // Example: 2 Bytes (AlsaFormat.S16_LE) * 2 (numChannels) * 32
		// (periodSize) = 128 Bytes
	 captureInstance.on("audio", (samples) => {
	    const data = {
	        samples,
	        sampleRate,
	        bitsPerSample,
	        channelCount,
	        numberOfFrames
	      };
	    source.onData(data);
	 });

    this.close = () => {
        captureInstance.close();
    };

    this.createTrack = () => {
      return source.createTrack();
    };
  }
}

module.exports = RTCAudioSourceAlsa;