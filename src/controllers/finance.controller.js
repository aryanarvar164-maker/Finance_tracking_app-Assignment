import { asynchandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Financial } from '../models/Financial.models.js';

const createRecord = asynchandler(async (req, res) => {
    const { amount, type, category, date, note } = req.body;

    if (!amount || !type || !category) {
        throw new ApiError(400, "field  are required must");
    }

    const record = await Financial.create({
        amount,
        type,
        date: date || Date.now(),
        category,
        note,
        createdBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, record, "financial record fetch successfully!!!")
    );
});

const updateRecord = asynchandler(async (req, res) => {
    const { id } = req.params
    const updateData = req.body

    if (!id) {
        throw new ApiError(400, "record_id is required");
    }

    const record = await FinancialRecord.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!record) {
        throw new ApiError(400, "records are not found");
    }

    return res.status(200).json(
        new ApiResponse(200, record, "records updat successfully")
    );
});

const deleteRecords = asynchandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "record id is not found");
    }

    const record = await FinancialRecord.findByIdAndDelete(id);

    if (!record) {
        throw new ApiError(404, "records are not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "records delet successfully!!")
    );
});

const getRecord = asynchandler(async (req, res) => {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    let matchStage = {};

    if (type) matchStage.type = type;
    if (category) matchStage.category = category;

    if (startDate || endDate) {
        matchStage.date = {};
        if (startDate) matchStage.date.$gte = new Date(startDate);
        if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const records = await FinancialRecord.find(matchStage)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'username fullName email');

    const totalRecords = await FinancialRecord.countDocuments(matchStage);

    return res.status(200).json(
        new ApiResponse(200, {
            records,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: parseInt(page)
        }, "records fetched successfully!!1")
    );
});

export {
    createRecord,
    updateRecord,
    deleteRecords,
    getRecord
};
