const WebIVRRequest = require("../models/WebIVRRequestModel");

class SlicanService {
  webIVRPostRegisterRequest = (req) => {
    console.log("request registration");
    console.log(req);

    let body = req.body;

    WebIVRRequest.create({
      bodyRaw: JSON.stringify(body),
      body,
      objProps: {
        ip: req.ip,
        host: req.hostname,
        protocol: req.protocol,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        path: req.path,
        method: req.method,
        queryRaw: JSON.stringify(req.query),
      },
      headers: {
        userAgent: req.get("User-Agent"),
        contentType: req.get("Content-Type"),
        contentLength: req.get("Content-Length"),
      },
    });
  };

  webIVRPostValidateAndProcessData = async (body) => {
    let status = "OK";
    return status;
  };

  webIVRPostGenerateResponse = async (body) => {
    let resType = "application/xml";
    let status = await this.webIVRPostValidateAndProcessData(body);

    let defaultResultXML = `
      <WebIVR>
        <Dial>
            <Extension>IVR firmowe</Extension>
            <Timeout>30</Timeout>
        </Dial>
      </WebIVR>`;

    let resultXML;

    switch (status) {
      case "OK":
      default:
        resultXML = defaultResultXML;
        break;
    }

    console.log("response generation: ", status, resultXML);
    
    return { resType, resultXML };
  };

  webIVRPostRegisterResponse = (resData) => {
    console.log("response registration: ", resData);
  };

  webIVRPostSendResponse = async (res, resData) => {
    console.log("sending response");
    let { resType, resultXML } = await resData;
    res.resType = resType;
    res.end(resultXML);
  };

  webIVRPostProcess = async (req, res) => {
    try {
      this.webIVRPostRegisterRequest(req);
      let body = req.body;
      let resData = this.webIVRPostGenerateResponse(body);
      this.webIVRPostSendResponse(res, resData);
      this.webIVRPostRegisterResponse(resData);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new SlicanService();
