self.onmessage = (e: MessageEvent) => {
  const { bufferLength, dataArray, type, isTeto, isNeru } = e.data;
  
  if (type === 'analyze') {
    let bassAvg = 0;
    let isKick = false;
    let trebleAvg = 0;
    let isClipping = false;
    
    // Teto - Bass calculations
    if (isTeto) {
      let bassSum = 0;
      for (let i = 0; i < 10; i++) {
        bassSum += dataArray[i] || 0;
      }
      bassAvg = bassSum / 10;
      isKick = bassAvg > 210;
    }
    
    // Neru - Treble calculations
    if (isNeru) {
      let trebleSum = 0;
      const trebleStart = Math.floor(bufferLength * 0.7);
      for (let i = trebleStart; i < bufferLength; i++) {
        trebleSum += dataArray[i] || 0;
      }
      trebleAvg = trebleSum / (bufferLength - trebleStart);
      isClipping = trebleAvg > 100;
    }
    
    // Post back results
    self.postMessage({
      bassAvg,
      isKick,
      trebleAvg,
      isClipping
    });
  }
};