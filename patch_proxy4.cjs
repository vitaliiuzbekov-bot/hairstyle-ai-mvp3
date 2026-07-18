const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `    } catch (error: any) {
      console.error('[Proxy Error] Ошибка проксирования:', error.message);
      res.status(500).send('Error proxying image');
  });`;

const replacement = `    } catch (error: any) {
      console.error('[Proxy Error] Ошибка проксирования:', error.message);
      res.status(500).send('Error proxying image');
    }
  });`;

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
console.log("Fixed catch closing brace");
