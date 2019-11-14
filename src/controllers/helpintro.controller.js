const InfoResponse = require('../shared/inforesponse');
const CONSTANTS = require('../shared/constants');
const logger = require('../shared/logger.js');
const helpIntroService = require('../services/helpintro.service');

const retrieveHelpIntro = async (req, res) => {
  let helpIntro = await helpIntroService.findByLangAndPageId(req.query.lang, req.query.pageid);
  if (!helpIntro) {
    // we are assuming there will be always some value for default
    helpIntro = await helpIntroService.findByLangAndPageId(CONSTANTS.HELPINTRO_DEFAULT_LANG, CONSTANTS.HELPINTRO_DEFAULT_PAGEID);
  }
  logger.debug(`query param lang${req.query.lang} pageid ${req.query.pageid}`);
  const jsonobj = JSON.parse(helpIntro.helpintro);
  jsonobj.showProgress = true;
  jsonobj.skipLabel = res.translate('helpintro.skiplabel');
  jsonobj.doneLabel = res.translate('helpintro.donelabel');
  jsonobj.nextLabel = res.translate('helpintro.nextlabel');
  jsonobj.prevLabel = res.translate('helpintro.prevlabel');
  jsonobj.overlayOpacity = '0.5';

  const infoResponse = new InfoResponse(res.translate('helpintro.success'));
  infoResponse.result = jsonobj;

  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};

module.exports = { retrieveHelpIntro };
