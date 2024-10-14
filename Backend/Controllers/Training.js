const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Fetch training details for particular Trainer
const all_train = async(req, res) => {
    const T_id = req.user.id;
    const events = await prisma.training.findMany({where: {T_id },
    orderBy:{start_date: 'desc'},
    include:{scores:true}});
    res.json(events);
}

//Fetching all the training details
const train_details = async(req, res) => {
    const events = await prisma.training.findMany({orderBy:{start_date:'desc'},
    include:{trainer:true}});
    res.json(events);
}

//Add Training
const add_train = async(req,res) => {
    try{
    const { id, name, start_date, end_date, domain, T_id } = req.body;
    const training = await prisma.training.create({
      data: { id, name, start_date : new Date(start_date), end_date : new Date(end_date), T_id , domain},
    });
    res.json("Successfully added training");
    }catch(error){
        if(error.code == 'P2002')
        res.json("Training already exists");
        else
        res.json(error);
    }
}

//Modify Training details
const update_train = async (req,res) => {
    const { name, start_date, end_date, T_id } = req.body;
    const { id } = req.params;
    try{
    const training = await prisma.training.update({
      where: { id:parseInt(id) },
      data: { name, start_date, end_date, T_id },
    });
    res.json("Training updated successfully");
    }catch(error){
        res.json(error);
    }
}

//Delete Training
const del_train = async(req, res) => {
    const { id } = req.params;
    try {
      const del = await prisma.training.delete({ where: { id:parseInt(id) } });
      res.json("Training Deleted Successfully");
    } catch (error) {
      res.json(error);
    }
}

module.exports = {all_train, add_train, update_train, del_train, train_details}