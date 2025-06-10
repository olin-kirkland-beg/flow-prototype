import express from 'express';
import StatusCode from 'status-code-enum';
const router = express.Router();

// / is used to ...
// =================================================================================================
router.get('/', (req, res) => {
    res.json({ foo: 'bar' }).status(StatusCode.SuccessOK);
});

export default router;
