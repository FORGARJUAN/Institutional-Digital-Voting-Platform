/**
 * REINICIO Y CONFIGURACIÓN DE LA BASE DE DATOS
 */
function resetearYConfigurarTodo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Hoja JURADOS Y ADMIN
  let hojaJurados = ss.getSheetByName("Jurados") || ss.insertSheet("Jurados");
  hojaJurados.clear();
  hojaJurados.getRange(1, 1, 3, 4).setValues([
    ["USUARIO", "CONTRASEÑA", "ROL", "NOMBRE"],
    ["admin", "admin123", "ADMIN", "Rectoría"],
    ["mesa1", "mesa123", "JURADO", "Mesa Principal"]
  ]);
  formatearEncabezado(hojaJurados);

  // 2. Hoja CONFIGURACIÓN (Define qué elecciones existen)
  let hojaConfig = ss.getSheetByName("Configuracion") || ss.insertSheet("Configuracion");
  hojaConfig.clear();
  hojaConfig.getRange(1, 1, 5, 3).setValues([
    ["CARGO", "ESTADO", "APLICA PARA"],
    ["Personero", "ACTIVA", "TODOS"],
    ["Contralor", "ACTIVA", "TODOS"],
    ["Cabildante", "ACTIVA", "TODOS"],
    ["Personerito", "ACTIVA", "PRIMARIA"]
  ]);
  formatearEncabezado(hojaConfig);

  // 3. NUEVA HOJA: CANDIDATOS (Aquí pones nombres y fotos)
  let hojaCand = ss.getSheetByName("Candidatos") || ss.insertSheet("Candidatos");
  hojaCand.clear();
  hojaCand.getRange(1, 1, 9, 4).setValues([
    ["CARGO", "NOMBRE", "NUMERO", "URL FOTO"],
    ["Personero", "Pepito Pérez", "01", "https://via.placeholder.com/150"],
    ["Personero", "Maria Gomez", "02", "https://via.placeholder.com/150"],
    ["Personero", "Voto en Blanco", "Blanco", "https://via.placeholder.com/150?text=Blanco"],
    ["Contralor", "Carlos Diaz", "01", "https://via.placeholder.com/150"],
    ["Contralor", "Voto en Blanco", "Blanco", "https://via.placeholder.com/150?text=Blanco"],
    ["Personerito", "Niño Ejemplo", "01", "https://via.placeholder.com/150"],
    ["Personerito", "Voto en Blanco", "Blanco", "https://via.placeholder.com/150?text=Blanco"],
    ["Cabildante", "Voto en Blanco", "Blanco", "https://via.placeholder.com/150?text=Blanco"]
  ]);
  formatearEncabezado(hojaCand);

  // 4. Hoja CENSO
  let hojaCenso = ss.getSheetByName("Censo") || ss.insertSheet("Censo");
  hojaCenso.clear();
  hojaCenso.getRange(1, 1, 3, 4).setValues([
    ["CÓDIGO ÚNICO", "NOMBRE", "CURSO", "YA VOTÓ"],
    ["11C01", "Estudiante Bachillerato", "11C", "N"],
    ["5A01",  "Estudiante Primaria", "5A",  "N"]
  ]);
  formatearEncabezado(hojaCenso);
  hojaCenso.getRange("A:A").setNumberFormat("@"); 

  // 5. Hoja VOTOS
  let hojaVotos = ss.getSheetByName("Votos") || ss.insertSheet("Votos");
  hojaVotos.clear();
  hojaVotos.getRange(1, 1, 1, 4).setValues([["FECHA", "CARGO", "CANDIDATO", "CURSO"]]);
  formatearEncabezado(hojaVotos);
}

function formatearEncabezado(hoja) {
  let rango = hoja.getRange(1, 1, 1, hoja.getLastColumn());
  rango.setBackground("#4a86e8").setFontColor("white").setFontWeight("bold");
  hoja.autoResizeColumns(1, hoja.getLastColumn());
}

/** -----------------------------------------
 * LÓGICA DEL SERVIDOR (BACKEND)
 * --------------------------------------- */

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate().setTitle("Sistema Electoral").addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 1. LOGIN (Soporta Admin y Jurado)
function loginSistema(usuario, password) {
  const data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Jurados").getDataRange().getValues();
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] == usuario && data[i][1] == password) {
      return { exito: true, rol: data[i][2], nombre: data[i][3] };
    }
  }
  return { exito: false };
}

// 2. OBTENER CURSOS (Filtra cursos donde TODOS ya votaron)
function obtenerCursosPendientes() {
  const datos = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Censo").getDataRange().getValues();
  let conteoCurso = {}; // { "11C": {total: 10, votaron: 5} }

  // Analizar cada estudiante
  for(let i = 1; i < datos.length; i++) {
    let curso = datos[i][2];
    let yaVoto = datos[i][3];
    
    if(!conteoCurso[curso]) conteoCurso[curso] = {total: 0, votados: 0};
    conteoCurso[curso].total++;
    if(yaVoto === "S") conteoCurso[curso].votados++;
  }

  // Retornar solo cursos que faltan por completar
  let cursosDisponibles = [];
  for (let curso in conteoCurso) {
    if (conteoCurso[curso].votados < conteoCurso[curso].total) {
      cursosDisponibles.push(curso);
    }
  }
  return cursosDisponibles.sort();
}

// 3. OBTENER ESTUDIANTES (Filtra los que YA votaron)
function obtenerEstudiantesPendientes(curso) {
  const datos = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Censo").getDataRange().getValues();
  let estudiantes = [];
  for(let i = 1; i < datos.length; i++) {
    // Coincide curso Y NO ha votado
    if(datos[i][2] == curso && datos[i][3] !== "S") {
      estudiantes.push({ codigo: datos[i][0], nombre: datos[i][1] });
    }
  }
  return estudiantes;
}

/**
 * OBTENER CANDIDATOS CON CONVERSIÓN DE IMAGEN DRIVE AUTOMÁTICA
 */
function obtenerTarjeton(cursoEstudiante) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = ss.getSheetByName("Configuracion").getDataRange().getValues();
  const candidatos = ss.getSheetByName("Candidatos").getDataRange().getValues();
  
  // Lógica de nivel mejorada
  // Lógica de nivel ultra-precisa
  let cursoStr = cursoEstudiante.toString().toUpperCase().trim();
  
  // Definimos qué palabras o números activan el modo PRIMARIA
  // Incluimos el "0", "TRANSICION", "JARDIN", y los grados del 1 al 5
  let esPrimaria = false;
  
  if (cursoStr.startsWith("0") || 
      cursoStr.includes("TRANSICION") || 
      cursoStr.includes("JARDIN") ||
      ( /^[1-5]/.test(cursoStr) && !cursoStr.startsWith("10") && !cursoStr.startsWith("11") )
     ) {
    esPrimaria = true;
  }

  let nivel = esPrimaria ? "PRIMARIA" : "BACHILLERATO"; 
  
  let eleccionesActivas = [];

  for (let i = 1; i < config.length; i++) {
    if (config[i][1] === "ACTIVA" && (config[i][2] === "TODOS" || config[i][2] === nivel)) {
      let cargo = config[i][0];
      let listaCandidatos = [];
      
      for(let j=1; j < candidatos.length; j++) {
        if(candidatos[j][0] === cargo) {
          let urlOriginal = candidatos[j][3];
          let urlDirecta = urlOriginal;

          // TRUCO MÁGICO: Si el link es de Drive, lo convertimos aquí mismo
          if (urlOriginal.includes("drive.google.com")) {
            // Extraemos el ID del archivo del enlace de compartir
            let idImagen = urlOriginal.split("/d/")[1].split("/")[0];
            urlDirecta = "https://drive.google.com/uc?export=view&id=" + idImagen;
          }

          listaCandidatos.push({
            nombre: candidatos[j][1],
            numero: candidatos[j][2],
            foto: urlDirecta // Enviamos el link ya procesado
          });
        }
      }
      if(listaCandidatos.length > 0) {
        eleccionesActivas.push({ cargo: cargo, candidatos: listaCandidatos });
      }
    }
  }
  return eleccionesActivas;
}

// 5. REGISTRAR VOTO (ACTUALIZADO PARA GUARDAR LA MESA)
function registrarVotoFinal(paquete) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaVotos = ss.getSheetByName("Votos");
  const hojaCenso = ss.getSheetByName("Censo");
  const fecha = new Date();
  
  paquete.votos.forEach(v => {
    // AQUÍ AGREGAMOS paquete.mesa AL FINAL PARA QUE SE GUARDE EN LA COLUMNA E
    hojaVotos.appendRow([fecha, v.cargo, v.candidato, paquete.curso, paquete.mesa]);
  });
  
  // Marcar estudiante
  const dataCenso = hojaCenso.getDataRange().getValues();
  for(let i = 1; i < dataCenso.length; i++) {
    if(dataCenso[i][0].toString() === paquete.codigoEstudiante.toString()) {
      hojaCenso.getRange(i+1, 4).setValue("S");
      break;
    }
  }
  return "OK";
}

// 6. ESTADÍSTICAS PARA ADMIN (CORREGIDO ERROR DE CONGELAMIENTO POR FECHAS)
function obtenerEstadisticas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const votosData = ss.getSheetByName("Votos").getDataRange().getValues();
  const censoData = ss.getSheetByName("Censo").getDataRange().getValues();
  const candidatosData = ss.getSheetByName("Candidatos").getDataRange().getValues();
  
  // Participación Global
  let votantesUnicos = 0;
  for(let i=1; i<censoData.length; i++) {
    if(censoData[i][3] === "S") votantesUnicos++;
  }

  // Extraer todos los votos detallados
  let votos = [];
  for(let i=1; i<votosData.length; i++) {
    // EL TRUCO ESTÁ AQUÍ: Convertimos la fecha a texto para que Google no se congele
    let fechaOriginal = votosData[i][0];
    let fechaTexto = (fechaOriginal instanceof Date) ? fechaOriginal.toISOString() : fechaOriginal;

    votos.push({
      fecha: fechaTexto, 
      cargo: votosData[i][1],
      candidato: votosData[i][2],
      curso: votosData[i][3],
      mesa: votosData[i][4] ? votosData[i][4].toString() : "No registrada"
    });
  }

  // Extraer información de candidatos (incluyendo fotos)
  let candidatos = [];
  for(let i=1; i<candidatosData.length; i++) {
    let urlOriginal = candidatosData[i][3] || "";
    let urlDirecta = urlOriginal;
    
    // Convertidor de imagen de Google Drive
    if (urlOriginal.includes("drive.google.com")) {
      try {
        let idImagen = urlOriginal.split("/d/")[1].split("/")[0];
        urlDirecta = "https://lh3.googleusercontent.com/u/0/d/" + idImagen;
      } catch(e) {}
    }
    
    candidatos.push({
      cargo: candidatosData[i][0],
      nombre: candidatosData[i][1],
      foto: urlDirecta
    });
  }

  return {
    censoTotal: censoData.length - 1,
    votantesUnicos: votantesUnicos,
    votos: votos,
    candidatos: candidatos
  };
}