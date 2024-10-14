const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add Score
const add_score = async (req, res) => {
  try {
    const { data } = req.body;
    const existingEvaluation = await prisma.score.findUnique({
      where: {
        T_id_E_id: {
          T_id: data.T_id,
          E_id: data.E_id,
        },
      },
    });
    let response;
    console.log(existingEvaluation,0)
    if (existingEvaluation) {
      response = await prisma.score.update({
        where: {
          T_id_E_id: {
            E_id: data.E_id,
            T_id: data.T_id,
          },
        },
        data: {
          score: data.score,
          punctuality: data.punctuality,
          discipline: data.discipline,
          standards: data.standards,
          remarks: data.remarks,
        },
      });
    } else {
      response = await prisma.score.create({
        data: {
          E_id: data.E_id,
          T_id: data.T_id,
          score: data.score,
          punctuality: data.punctuality,
          discipline: data.discipline,
          standards: data.standards,
          remarks: data.remarks,
        },
      });
    }
    console.log(response);
    res.json(response); 
  } catch (error) {
    console.error('Error processing scores:', error);
    return res.status(500).json({ message: 'An error occurred', error });
  }
};


// Fetch scores for training
const get_score = async(req,res) => {
    const T_id = parseInt(req.params.id)
    try{
    const scores = await prisma.score.findMany({
        where:{T_id},
      include : { training:true,
        employee:true
      }
    });
        res.json(scores);
    }catch(error){res.json(error);
    }
}
 // Fetch scores
const get_scores = async(req,res) => {
    try{
    const scores = await prisma.score.findMany({
      include : { training:true,
        employee:true
      }
    });
        res.json(scores);
    }catch(error){res.json(error);
    }
}

const get_score_emp = async(req,res) => {
  const E_id = parseInt(req.params.id);
  try{
  const scores = await prisma.score.findMany({
    where:{E_id},
    include : { training:true,
      employee:true
    }
  });
      res.json(scores);
  }catch(error){res.json(error);
  }
}

module.exports = {add_score, get_score, get_scores, get_score_emp}