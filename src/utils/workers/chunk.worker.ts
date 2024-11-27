// 文件分片处理 Worker
self.onmessage = async (e: MessageEvent) => {
  console.log('Worker message:', e.data);
  const { file, chunkSize } = e.data;
  const chunks: Blob[] = [];
  const totalChunks = Math.ceil(file.size / chunkSize);
  
  // 计算文件 hash (可用于秒传和断点续传)
  const calculateHash = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const fileHash = await calculateHash(file);

  // 分割文件
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
}; 