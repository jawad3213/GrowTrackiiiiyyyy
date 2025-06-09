require("dotenv").config();
const { Pool } = require("pg");
const { exec } = require("child_process");



const neonDB = new Pool({
    connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});


const localDB = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "NaDa2004",
  port: 5432,
});


const dumpFile = "backup_skills.sql";


async function copyDatabase() {
  try {
    console.log("Exportation de la base de données depuis Neon Tech...");

    
    await new Promise((resolve, reject) => {
        exec(
         `pg_dump "${process.env.DATABASE_URL}" -F p -f ${dumpFile} --no-owner --no-privileges`,
          (error, stdout, stderr) => {
            if (error) {
              console.error("Erreur lors de l'exportation : ${error.message}");
              reject(error);
            } else {
              console.log("Exportation réussie !");
              resolve();
            }
          }
        );
      });

  
    
    console.log("Suppression de l'ancienne base locale...");
    await localDB.query("DROP DATABASE IF EXISTS skills;");

    
    console.log("Création de la base locale...");
    await localDB.query("CREATE DATABASE skills;");

    
    
    console.log("Restauration de la base en local...");
    await new Promise((resolve, reject) => {
      exec(`psql -U postgres -d skills -f ${dumpFile}`, (error, stdout, stderr) => {
        if (error) {
          console.error("Erreur lors de la restauration : ${error.message}");
          reject(error);
        } else {
          console.log("Base de test créée avec succès !");
          resolve();
        }
      });
    });

  } catch (err) {
    console.error("Erreur générale :", err);
  } finally {
    await neonDB.end();
  }
}


if (require.main === module) {
  copyDatabase();
}


module.exports = localDB;



