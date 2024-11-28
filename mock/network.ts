import Mock from 'mockjs';

// 添加一个开关来控制是否启用 mock
const ENABLE_MOCK = false;  // 设置为 false 来禁用 mock

if (ENABLE_MOCK) {
  // 配置 Mock 延时
  Mock.setup({
    timeout: '200-600'
  });

  // GET 请求测试
  Mock.mock('/api/test', 'get', {
    code: 200,
    data: {
      'id|+1': 1,
      name: '@name',
      time: '@datetime',
      message: 'GET 请求成功'
    }
  });

  // POST 请求测试
  Mock.mock('/api/test', 'post', (options: { body: string }) => {
    console.log('options', options);
    const body = JSON.parse(options.body);
    return {
      code: 200,
      data: {
        ...body,
        id: '@guid',
        serverTime: '@datetime',
        message: 'POST 请求成功'
      }
    };
  });

  // 文件上传测试
  Mock.mock('/api/upload', 'post', {
    code: 200,
    data: {
      fileId: '@guid',
      fileName: '@word(5,10).txt',
      fileUrl: '@url',
      uploadTime: '@datetime',
      message: '文件上传成功'
    }
  });

  // 请求重试测试
  Mock.mock('/api/test-retry', 'get', () => {
    const shouldFail = Math.random() > 0.5;
    if (shouldFail) {
      return {
        code: 500,
        message: '服务器错误，请重试'
      };
    }
    return {
      code: 200,
      data: {
        id: '@guid',
        time: '@datetime',
        message: '重试请求成功'
      }
    };
  });

  // 请求超时测试
  Mock.mock('/api/test-timeout', 'get', {
    code: 200,
    data: {
      message: '请求完成'
    }
  });

  // 并发请求测试
  Mock.mock(new RegExp('/api/test-concurrent/.*'), 'get', {
    code: 200,
    data: {
      id: '@guid',
      time: '@datetime',
      'delay|100-2000': 1,
      message: '并发请求成功'
    }
  });

  // 错误请求测试
  Mock.mock('/api/test-error', 'get', {
    code: 500,
    message: '模拟服务器错误'
  });

  // 文件下载测试
  Mock.mock('/api/download', 'get', () => {
    // 这里只返回成功状态，实际下载会走真实接口
    return {
      code: 200,
      message: '文件下载成功'
    };
  });

  // 获取文件列表
  Mock.mock('/api/files', 'get', {
    code: 200,
    data: [
      {
        name: 'test1.txt',
        size: 1024,
        createTime: '@datetime',
        updateTime: '@datetime'
      },
      {
        name: 'test2.txt',
        size: 2048,
        createTime: '@datetime',
        updateTime: '@datetime'
      }
    ],
    message: '获取文件列表成功'
  });
} 