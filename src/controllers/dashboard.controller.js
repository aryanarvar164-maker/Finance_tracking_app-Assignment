import { asynchandler } from '../utils/asynchandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Financial } from '../models/Financial.models.js';

const getDashboardstats = asynchandler(async (req, res) => {
    // calculate income, expense
    const aggregationPipeline = [
        {
            $facet: {
                totalIncome: [
                    {
                        $match: { type: 'income' }
                    },
                    {
                        $group: { _id: null, amount: { $sum: "$amount" } }
                    }
                ],
                totalExpense: [
                    {
                        $match: { type: 'expense' }
                    },
                    {
                        $group: { _id: null, amount: { $sum: "$amount" } }
                    }
                ],
                categoryTotals: [
                    {
                        $group: { _id: "$category", totalAmount: { $sum: "$amount" } }
                    }
                ],
                monthlySummary: [
                    {
                        $group: {
                            _id: {
                                year: { $year: "$date" },
                                month: { $month: "$date" },
                                type: "$type"
                            },
                            total: { $sum: "$amount" }
                        }
                    },
                    {
                        $sort: { "_id.year": 1, "_id.month": 1 }
                    }
                ]
            }
        }
    ];

    const stats = await Financial.aggregate(aggregationPipeline);

    const result = stats[0];

    const income = result.totalIncome.length > 0 ? result.totalIncome[0].amount : 0;
    const expense = result.totalExpense.length > 0 ? result.totalExpense[0].amount : 0;
    const netBalance = income - expense;

    // ready for the frontend!
    const formattedStats = {
        totalIncome: income,
        totalExpense: expense,
        netBalance,
        categoryTotals: result.categoryTotals,
        monthlySummary: result.monthlySummary
    };

    return res.status(200).json(
        new ApiResponse(200, formattedStats, "Dashboard info fetched successfully!!")
    );
});

export { getDashboardstats };
