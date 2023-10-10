const Hackathon = require('../../models/admin/hackathon');
const { httpStatus200, httpStatus500, httpStatus409 } = require('../../utils/httpResponse');

const createHackathon = async (req, res) => {

    const { hackathonId } = req.query;
    const { title,hackathonType,submissionType,startDate,maxStartDate,endDate,resultDate,prices, questions, details } = req.body;
    const {question, questionType, instruction, outOf} = questions || {};

    if (hackathonId) {
        const addQuestion = await Hackathon.findOneAndUpdate(
            { _id: hackathonId },
            { $push: { questions: {
                question,
                questionType,
                instruction,
                outOf
            } } },
            { new: true }
        );
        if (!addQuestion) {
            return res.status(500).json(httpStatus500({ message: "Failed to add question" }));
        }
        return res
            .status(200)
            .json(httpStatus200(addQuestion, 'question added successfully'));
    }

    const regex = new RegExp(["^", title, "$"].join(""), "i");

    const response = await Hackathon.findOne({ title: regex });

    if (response) {
        return res.status(409).json(httpStatus409("Hackathon title already exists"));
    }

    const createHackathon = await Hackathon.create({
        title,hackathonType,submissionType,startDate,maxStartDate,endDate,resultDate,prices, questions, details
    });

    if (!createHackathon) {
        return res.status(500).json(httpStatus500({ message: "Failed to create Hackathon" }));
    }
    return res
        .status(200)
        .json(httpStatus200(createHackathon, 'Hackathon created successful'));


};

module.exports = createHackathon;
