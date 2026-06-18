import fs from 'fs';
import path from 'path';

const filesToDelete = [
  'check.ts', 'cleanup.ts', 'face.jpg', 'fetch_api.ts', 'fix.cjs', 'fix2.cjs',
  'kill_3000.cjs', 'kill_all.cjs', 'openapi.json', 'openapi_faceswap.json',
  'openapi_flux.json', 'openapi_flux_general.json', 'openapi_general.json',
  'openapi_i2i.json', 'openapi_pulid.json', 'out_fbvsa794ctmiri65dl9u.jpg',
  'refactor.ts', 'refactor_frontend.ts', 'refactor_tokens.ts', 'refactor_tokens2.ts',
  'refactor_tokens3.ts', 'replace.cjs', 'result.txt', 'test_admin.ts', 'test_admin2.ts',
  'test_analyze.ts', 'test_analyze2.ts', 'test_api.ts', 'test_cdn.js', 'test_cdn2.ts',
  'test_client.ts', 'test_client2.ts', 'test_env.js', 'test_express.cjs', 'test_face.jpg',
  'test_fetch_eb.ts', 'test_generation.ts', 'test_get.ts', 'test_image.ts',
  'test_integration.ts', 'test_jpeg.ts', 'test_log.txt', 'test_real_face.ts',
  'test_req.js', 'test_server.ts', 'test_vton.ts', 'test_vton2.ts', 'test_yandex_vision.ts',
  'test_yv.ts', 'test_yv_photo.ts', 'tmp.txt', 'update_stars.cjs', 'src/try_yandex_art_i2i.ts',
  'cleanup_garbage.ts'
];

filesToDelete.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted ${file}`);
  }
});
