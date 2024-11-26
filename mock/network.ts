import { MockMethod } from 'vite-plugin-mock';
import { Random } from 'mockjs';

// 模拟延迟
const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

export default [
  // GET 请求测试
  {
    url: '/api/test',
    method: 'get',
    response: async () => {
      await sleep(1000); // 模拟网络延迟
      return {
        code: 200,
        data: {
          id: Random.id(),
          name: Random.name(),
          time: Random.datetime(),
          message: 'GET 请求成功'
        }
      };
    }
  },

  // POST 请求测试
  {
    url: '/api/test',
    method: 'post',
    response: async ({ body }) => {
      await sleep(1000);
      return {
        code: 200,
        data: {
          ...body,
          id: Random.id(),
          serverTime: Random.datetime(),
          message: 'POST 请求成功'
        }
      };
    }
  },

  // 文件上传测试
  {
    url: '/api/upload',
    method: 'post',
    response: async ({ body }) => {
      // 模拟分块上传延迟
      const chunks = 5;
      for (let i = 0; i < chunks; i++) {
        await sleep(500);
      }
      return {
        code: 200,
        data: {
          fileId: Random.guid(),
          fileName: body.file?.name || 'unknown',
          fileUrl: Random.url(),
          uploadTime: Random.datetime(),
          message: '文件上传成功'
        }
      };
    }
  },

  // 文件下载测试
  {
    url: '/api/download',
    method: 'get',
    rawResponse: async (req, res) => {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="test.txt"');
      
      // 模拟分块下载
      const chunks = ['这是一个', '测试文件', '内容'];
      for (const chunk of chunks) {
        await sleep(500);
        res.write(Buffer.from(chunk));
      }
      res.end();
    }
  },

  // 请求重试测试
  {
    url: '/api/test-retry',
    method: 'get',
    response: async (req) => {
      // 模拟随机失败
      const shouldFail = Math.random() > 0.5;
      await sleep(1000);

      if (shouldFail) {
        return {
          code: 500,
          message: '服务器错误，请重试'
        };
      }

      return {
        code: 200,
        data: {
          id: Random.id(),
          time: Random.datetime(),
          message: '重试请求成功'
        }
      };
    }
  },

  // 请求超时测试
  {
    url: '/api/test-timeout',
    method: 'get',
    response: async () => {
      await sleep(5000); // 5秒延迟
      return {
        code: 200,
        data: {
          message: '请求完成'
        }
      };
    }
  },

  // 并发请求测试
  {
    url: '/api/test-concurrent/:id',
    method: 'get',
    response: async ({ params }) => {
      const delay = Math.random() * 2000; // 随机延迟 0-2 秒
      await sleep(delay);
      return {
        code: 200,
        data: {
          id: params.id,
          time: Random.datetime(),
          delay: `${delay.toFixed(0)}ms`
        }
      };
    }
  },

  // 错误请求测试
  {
    url: '/api/test-error',
    method: 'get',
    statusCode: 500,
    response: {
      code: 500,
      message: '模拟服务器错误'
    }
  },

  // 取消请求测试
  {
    url: '/api/test-cancel',
    method: 'get',
    response: async () => {
      await sleep(3000); // 3秒延迟
      return {
        code: 200,
        data: {
          message: '请求完成'
        }
      };
    }
  }
] as MockMethod[]; 