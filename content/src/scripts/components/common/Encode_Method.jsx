export const encodeHTML=(str)=>{
  if (typeof (str) !== "undefined") {
              str = str.replace(/:/g, "&#58;");
              str = str.replace(/\'/g, "&#39;");
              str = str.replace(/=/g, "&#61;");
              str = str.replace(/\(/g, "&#40;");
              str = str.replace(/\)/g, "&#41;");
              str = str.replace(/</g, "&lt;");
              str = str.replace(/>/g, "&gt;");
              str = str.replace(/\"/g, "&quot;");
              str = str.replace(/\‘/g, "&#8216;");
              str = str.replace(//g, "");
              str = str.replace(/ /g,'+')
          }
          else {
              str = "";
          }
          return str;
}

export const decodeHTML= (str,lineFeed)=>{
  //decoding HTML entites to show in textfield and text area
         if (typeof (str) !== "undefined") {
             str = str.replace(/&amp;/g, "&");
             str = str.replace(/&#58;/g, ":");
             str = str.replace(/&#39;/g, "\'");
             str = str.replace(/&#40;/g, "(");
             str = str.replace(/&#41;/g, ")");
             str = str.replace(/&lt;/g, "<");
             str = str.replace(/&gt;/g, ">");
             str = str.replace(/&gt;/g, ">");
             str = str.replace(/&#9;/g, "\t");
             str = str.replace(/&nbsp;/g, " ");
             str = str.replace(/&quot;/g, "\"");
             str = str.replace(/&#8216;/g, "‘");
             str = str.replace(/&#61;/g, "=");
             str = str.replace(/%252B/g,' ');
             str = str.replace(/\+/g, " ");
             if (lineFeed) {
                 str = str.replace(/&line;/g, "\n");   // NEED TO DISCUSS THIS WITH UMAIR
             }
         }
         else {
             str = "";
         }
         return str;
}
