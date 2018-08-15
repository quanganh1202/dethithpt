import express from 'express';
import {
  createYearSchool,
  deleteYearSchoolById,
  getYearSchoolById,
  getListYearSchools,
  updateYearSchool,
} from '../../src/controller/yearSchool';

const routerDefine =  function defineRouter() {
  // Destination folder path
  const route = express.Router();

  route.get('/yearschools', async (req, res) => {
    const result = await getListYearSchools(req.query);
    res.status(200).json({
      data: result,
    });
  });

  route.get('/yearschools/:id', async (req, res) => {
    const { error, data, status } = await getYearSchoolById(req.params.id, req.query.cols);
    if (error)
      return res.status(status || 500).json({
        error,
      });

    res.status(status || 200).json({
      data,
    });
  });

  route.post('/yearschools', async (req, res) => {
    const { error, message, status } = await createYearSchool(req.body);
    if (!error) {
      return res.status(status || 201).json({
        message,
      });
    }

    return res.status(status || 500).json({
      error,
    });
  });

  route.put('/yearschools/:id', async (req, res) => {
    const { error, message, status } = await updateYearSchool(req.params.id, req.body);
    if (error) {
      return res.status(status).json({
        error,
      });
    }
    res.status(status).json({
      data: message,
    });
  });

  route.delete('/yearschools/:id', async (req, res) => {
    const { error, message, status } = await deleteYearSchoolById(req.params.id);
    if (error) {
      return res.status(status || 500).json({ error });
    }

    res.status(status || 200).json({ message });
  });

  return route;
};

export default routerDefine;