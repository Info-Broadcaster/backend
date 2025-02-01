const request = require("supertest");
const express = require("express");
const getStatisticsRouter = require("../../routes/get-statistics");
const { getTrackerDataFromLinkly } = require("../../logique/link-tracker");

jest.mock("../../logique/link-tracker");
global.console = { 
    log: jest.fn(),
    error: jest.fn()
};

const app = express();
app.use(express.json());
app.use("/get-statistics", getStatisticsRouter);

describe("GET /get-statistics", () => {
    it("should return 200 if tracker data is found", async () => {
        getTrackerDataFromLinkly.mockResolvedValue({ data: "tracker data" });

        const res = await request(app).get("/get-statistics");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: "tracker data" });
    });

    it("should return 400 if an error occurred", async () => {
        getTrackerDataFromLinkly.mockRejectedValue(new Error("An error occurred"));

        const res = await request(app).get("/get-statistics");

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "An error occurred" });
    });
});
