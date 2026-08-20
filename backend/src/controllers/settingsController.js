import Settings from "../models/Settings.js";
import { success } from "../utils/api.js";
export const getSettings = async (req, res) => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  success(res, 200, "Settings fetched", { settings: s });
};
export const updateSettings = async (req, res) => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create(req.body);
  else {
    Object.assign(s, req.body);
    await s.save();
  }
  success(res, 200, "Settings updated", { settings: s });
};
