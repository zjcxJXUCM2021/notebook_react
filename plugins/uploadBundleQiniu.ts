import qiniu from 'qiniu';
import path from 'path';
import type { Plugin } from 'vite';
import type { OutputBundle } from 'rollup';
export interface QiniuOptions {
    accessKey: string;
    secretKey: string;
    bucket: string;
    zone?: keyof typeof qiniu.zone;

    /**
     * 🎯 [新增] 上传的根目录（前缀）
     * 例如：'project-a/v1.0.0/'
     * 如果不传，则默认上传到 Bucket 根目录
     */
    remotePath?: string;

    /**
     * 缓存控制
     */
    cacheControl?: {
        html?: number;
        assets?: number;
    } | number;
}

export default function uploadBundleQiniu(options: QiniuOptions): Plugin {
    const mac = new qiniu.auth.digest.Mac(options.accessKey, options.secretKey);
    const config = new qiniu.conf.Config();
    if (options.zone && qiniu.zone[options.zone]) {
        config.zone = qiniu.zone[options.zone];
    }

    const formUploader = new qiniu.form_up.FormUploader(config);
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    const putExtra = new qiniu.form_up.PutExtra();

    // 辅助函数：计算缓存头
    const getCacheControlHeader = (fileName: string): string | null => {
        if (!options.cacheControl) return null;
        let maxAge = 0;
        if (typeof options.cacheControl === 'number') {
            maxAge = options.cacheControl;
        } else {
            const isHtml = fileName.endsWith('.html');
            maxAge = isHtml ? (options.cacheControl.html ?? 0) : (options.cacheControl.assets ?? 31536000);
        }
        return `public, max-age=${maxAge}`;
    };

    return {
        name: "uploadBundleQiniu",
        writeBundle: async (_outputOptions, bundle: OutputBundle) => {
            const uploadPromises: Promise<void>[] = [];

            // 获取配置的根目录，默认为空字符串
            // 🎯 关键点 1
            const remotePrefix = options.remotePath || '';

            console.log(`\n🚀 [Qiniu] 开始上传到: ${options.bucket}/${remotePrefix}`);

            for (const [fileName, file] of Object.entries(bundle)) {
                // 🎯 关键点 2: 路径拼接
                // 使用 path.posix.join 确保在 Windows 下也生成 "dir/file.js" 而不是 "dir\file.js"
                // 它会自动处理多余的斜杠，比如 'v1//' + '/assets' -> 'v1/assets'
                const key = path.posix.join(remotePrefix, fileName);

                const content = file.type === 'asset' ? file.source : file.code;

                // scope: 允许覆盖同名文件
                const putPolicy = new qiniu.rs.PutPolicy({
                    scope: `${options.bucket}:${key}`
                });
                const uploadToken = putPolicy.uploadToken(mac);

                const task = new Promise<void>((resolve, reject) => {
                    formUploader.put(uploadToken, key, content, putExtra, async (respErr, _respBody, respInfo) => {
                        if (respErr) return reject(respErr);
                        if (respInfo.statusCode !== 200) return reject(new Error(`Status: ${respInfo.statusCode}`));

                        // 修改 Header 逻辑（保持不变）
                        const cacheHeader = getCacheControlHeader(fileName);
                        if (cacheHeader) {
                            try {
                                await bucketManager.changeHeaders(options.bucket, key, { 'Cache-Control': cacheHeader });
                            } catch (e) { /* ignore */ }
                        }

                        console.log(`✅ ${fileName} -> ${key}`);
                        resolve();
                    });
                });

                uploadPromises.push(task);
            }

            try {
                await Promise.all(uploadPromises);
                console.log(`✨ [Qiniu] 上传完成！\n`);
            } catch (error) {
                console.error(`💥 [Qiniu] 上传失败`, error);
            }
        }
    }
}