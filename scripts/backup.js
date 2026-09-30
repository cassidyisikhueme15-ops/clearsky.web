const fs=require('fs');
const path=require('path');
const Database=require('better-sqlite3');
const root=path.join(__dirname,'..');
const dbPath=path.join(root,'clearsky.db');
if(!fs.existsSync(dbPath)){console.error('clearsky.db not found. Start ClearSky once first.');process.exit(1)}
const outDir=path.join(root,'backups');fs.mkdirSync(outDir,{recursive:true});
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const out=path.join(outDir,`clearsky-${stamp}.db`);
const db=new Database(dbPath);
db.pragma('wal_checkpoint(TRUNCATE)');
db.backup(out).then(()=>{db.close();console.log(`Backup created: ${out}`)}).catch(e=>{db.close();console.error(e);process.exit(1)});
