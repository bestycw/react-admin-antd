// 文件分片处理 Worker
self.onmessage = async (e: MessageEvent) => {
  try {
    console.log('Worker received file:', e.data.file.name, e.data.file.size);
    const { file, chunkSize } = e.data;
    const chunks: Blob[] = [];
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    // 计算文件 hash (可用于秒传和断点续传)
    const calculateHash = async (file: File) => {
      try {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (error) {
        console.error('Hash calculation error:', error);
        throw error;
      }
    };

    console.log('Starting hash calculation...');
    const fileHash = await calculateHash(file);
    console.log('File hash:', fileHash);

    // 分割文件
    console.log('Starting file chunking...');
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      chunks.push(chunk);

      // 报告进度
      self.postMessage({
        type: 'progress',
        data: {
          current: i + 1,
          total: totalChunks,
          percent: Math.round(((i + 1) / totalChunks) * 100)
        }
      });
    }

    console.log('File chunking complete. Total chunks:', chunks.length);

    // 返回分片结果
    self.postMessage({
      type: 'complete',
      data: {
        chunks,
        fileHash,
        fileName: file.name,
        totalSize: file.size,
        totalChunks
      }
    });
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({
      type: 'error',
      error: error.message
    });
  }
}; 