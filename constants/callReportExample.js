import axios from 'axios'
import qs from 'qs'
import fs from 'fs'
const HOST = "http://26.35.213.94:7878";
var cookie = "";
async function getCognosLogOff() {
    try {
        const url = HOST + '/bi/v1/disp?b_action=xts.run&m=portal/logoff.xts&h_CAM_action=logoff';
        const response = await axios.request({
            url: url,
            method: "GET",
            headers: {
                'Cache-Control': 'no-cache',
            },
            withCredentials: true,
        });
        console.log("----- App - getCognosLogOff - Success -----");
        
    } catch (error) {
        console.error("----- App - getCognosLogOff - Error:", error.message, "-----");
    }
}
function checkAndDeleteFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Existing file deleted: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error checking/deleting file: ${error.message}`);
    }
}
async function generateReport(code, outputPath) {
    try {
        // Kiểm tra và xóa file nếu tồn tại
        if (outputPath) {
            checkAndDeleteFile(outputPath);
        }
        
        const url = HOST + '/bi/v1/disp';
        let values = {
            "b_action": "cognosViewer",
            "ui.action": "run",
            "ui.object": "/content/folder[@name=\"micco\"]/report[@name=\"work order_copy2\"]",
            "run.prompt": "false",
            "p_R5_EDITIONS": "Y_",
            "p_R5_FUNC": "WZJOBQ",
            "p_R5_LANG": "VI",
            "o_p_R5_USER": "R5",
            "p_R5_ROLE": "*",
            "p_R5_VERSION": "12.0",
            "p_R5_ORG": "VIETBAC",
            "p_R5_TENANT": "MICCO",
            "p_R5_DUALCURR": "EUR",
            "p_R5_DEFORG": "*",
            "p_R5_DESTYPE": "PREVIEW",
            "p_R5_TIMEZONE": "0.0",
            "p_SEL_BARCODE": "-",
            "p_SEL_BOOKED": "-",
            "p_SEL_BOOKLABOR": "-",
            "p_SEL_END": "%",
            "p_SEL_JOB": code,
            "p_SEL_JOBTP": "%",
            "p_SEL_LOC": "%",
            "p_SEL_LOCUDFSCRN": "OSOBJL",
            "p_SEL_MRC": "%",
            "p_SEL_ORG": "LDV",
            "p_SEL_PERSON": "%",
            "p_SEL_POSUDFSCRN": "OSOBJP",
            "p_SEL_PPM": "%",
            "p_SEL_PRINTATTACH_IOFR": "-",
            "p_SEL_PRINTCFEVNT": "-",
            "p_SEL_PRINTCFOBJ": "-",
            "p_SEL_PRINTIMAGE": "-",
            "p_SEL_PRINTUDFACT": "-",
            "p_SEL_PRINTUDFEVNT": "-",
            "p_SEL_PRINTUDFOBJ": "-",
            "p_SEL_PRIOR": "%",
            "p_SEL_REPRINT": "-",
            "p_SEL_SCHGRP": "%",
            "p_SEL_START": "%",
            "p_SEL_STATUS": "%",
            "p_SEL_SYSUDFSCRN": "OSOBJS",
            "p_SEL_TASKINST": "-",
            "p_SEL_TRAD": "%",
            "p_SEL_TSKCHKLST": "-",
            "p_SEL_WOCOMM": "-",
            "p_SEL_WOUDFSCRN": "WSJOBS",
            "p_R5_FRONTPG": "+",
            "p_R5_CONFIDENTIAL": "-",
            "run.outputFormat": "PDF",
            "p_R5_BATCHTRANSACTIONID": "0",
            "p_R5_PRINTSUBID": "0",
            "p_SEL_OBJUDFSCRN": "OSOBJA",
            "p_SEL_NONCONFORM": "-",
            //"o_encoding": "UTF-8",
            "p_SEL_OBJCRIT": "%",
            "p_SEL_OBJ": "%",
            "CAMTenant": "MICCO",
            "CAMUsername": "R5",
            "CAMPassword": "Ingr.123",
            "h_CAM_action": "logonAs",
            "CAMNamespace": "HxGNEAM"
          }

        const response = await axios.request({
            url: url,
            method: "POST",
            data: qs.stringify(values),
            headers: {
                'Cache-Control': 'no-cache',
            },
            withCredentials: true
        });
        //get request cookies and save to cookie
        cookie = response.headers['set-cookie'];
        //log response
        //console.log(response.data);
        //nếu có tồn tại iframe hoặc <object>
        if (response.data.includes('<iframe') || response.data.includes('<object')) {
            console.log("----- Case 1 - Success -----");
            const iframe = response.data.match(/<iframe[^>]*>(.*?)<\/iframe>/gs);
            const src = iframe[0].match(/src="([^"]+)"/)[1];
            //log iframe
            console.log(iframe);
            //log src
            //console.log(src);
            //replace &amp; to &
            const replaced = src.replace(/&amp;/g, '&').replace('..', HOST + '/bi');
            //decode replace_decode    
            const replace_decoded = decodeURIComponent(replaced);
            //log replaced
            console.log(replace_decoded);
            //lấy param file value
            const param = replace_decoded.match(/file=([^&]+)/)[1];
            //url decode nó
            const decoded = decodeURIComponent(param);
            //tạo link đầy đủ
            const fullLink = HOST + decoded;
            console.log(fullLink);
            return fullLink;
        }
        else {
            console.log("----- Case 2 - Success -----");
            var result = response.data;
             //get all param
            var b_action = getParamString(result, '"b_action": "', '"');
            var cv_actionState = getParamString(result, '"cv.actionState": "', '"');
            var cv_id = getParamString(result, '"cv.id": "', '"');
            var cv_objectPermissions = getParamString(result, '"cv.objectPermissions": "', '"');
            var executionParameters = getParamString(result, '"m_sParameters": "', '"');
            var m_tracking = getParamString(result, '"m_sTracking": "', '"');
            var ui_cafcontextid = getParamString(result, '"m_sCAFContext": "', '"');
            var ui_conversation = getParamString(result, '"m_sConversation": "', '"');
            var ui_object = getParamString(result, '"ui.object": "', '",').replace(/\"/g, '"');
            var ui_objectClass = getParamString(result, '"ui.objectClass": "', '"');
            //log them all
            // console.log("b_action:", b_action);
            // console.log("cv.actionState:", cv_actionState);
            // console.log("cv.id:", cv_id);
            // console.log("cv.objectPermissions:", cv_objectPermissions);
            // console.log("executionParameters:", executionParameters);
            // console.log("m_tracking:", m_tracking);
            // console.log("ui.cafcontextid:", ui_cafcontextid);
            // console.log("ui.conversation:", ui_conversation);
            // console.log("ui.object:", ui_object);
            // console.log("ui.objectClass:", ui_objectClass);
            var fileName = outputPath || "work order_copy2.pdf";
            getCognosNoIframe(b_action, cv_actionState, cv_id, cv_objectPermissions, executionParameters, m_tracking, ui_cafcontextid, ui_conversation, ui_object, ui_objectClass, fileName);
        }
        

    } catch (error) {
        console.error("----- generateReport - Error:", error.message, "-----");
        return 'error';
    }
}
function getParamString(res, start, end) {
    var cutStr = res.substring(res.indexOf(start) + (start.length));
    return cutStr.substring(0, cutStr.indexOf(end));
}
async function getCognosNoIframe(b_action, cv_actionState, cv_id, cv_objectPermissions, executionParameters, m_tracking, ui_cafcontextid, ui_conversation, ui_object, ui_objectClass, fileName) {
    // Kiểm tra và xóa file nếu tồn tại
    checkAndDeleteFile(fileName);
    
    let url = HOST + '/bi/v1/disp';
    let values = {
      "b_action": b_action,
      "cv.actionState": cv_actionState,
      "cv.catchLogOnFault": "true",
      "cv.id": cv_id,
      "cv.objectPermissions": cv_objectPermissions,
      "cv.responseFormat": "data",
      "cv.showFaultPage": "true",
      "executionParameters": executionParameters,
      "m_tracking": m_tracking,
      "ui.action": "wait",
      "ui.cafcontextid": ui_cafcontextid,
      "ui.conversation": ui_conversation,
      "ui.object": ui_object,
      "ui.objectClass": ui_objectClass,
      "ui.primaryAction": "run",
    }
    //use cookie    
    var result = await axios.request({
      url: url,
      method: "POST",
      data: qs.stringify(values),
      async: true,
      headers: {
        'Cache-Control': 'no-cache',
        'Cookie': cookie,
      },
      withCredentials: true,
    }).then(async (response) => {
        var result = response.data;
        if (result.indexOf('<iframe') > 0) {
            var newiframe = result.substring(result.indexOf('<iframe'), result.lastIndexOf('</iframe>'));
            var newURL = newiframe.substring(newiframe.indexOf('/bi/v1/disp?'), newiframe.lastIndexOf('" style'));
            var newConfigURL = newURL.replace(/&amp;/g, '&');
            newConfigURL = newConfigURL.replace('<iframe width="100%" src="../pdf.js/web/viewer.html?file=', '');
            newConfigURL = decodeURIComponent(newConfigURL);
            var newURLFinal = HOST + newConfigURL;
            var pdf = await axios.get(newURLFinal, { responseType: 'arraybuffer', headers: {
                'Cookie': cookie,
            } });
            fs.writeFileSync(fileName, pdf.data);
            console.log("----- Case 1 - Download Success -----");
            console.log("File saved to:", fileName);
            return fileName;
        } else if (result.indexOf('<object') > 0) {
            
            
        }
    }).catch((e) => {
        console.error("----- Case 1 - Error:", e.message, "-----");
        return 'error';
    });
    
}
const jobCode = process.argv[2];
const outputPath = process.argv[3];

if (!jobCode) {
    console.error("Please provide a job code as argument");
    process.exit(1);
}

getCognosLogOff()
generateReport(jobCode, outputPath)

