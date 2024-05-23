import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  userId: string; // 用户唯一标识符
  ip: string; // 用户的 IP 地址
  ipLocation: string;
  userAgent: string; // 用户的浏览器和操作系统信息
  location: string; // 用户的地理位置
  name: string; // 用户的全名
  gender: string; // 用户的性别
  budget?: number; // 用户为项目预算的金额
  numberOfUsers?: number; // 预期使用系统的用户数量
  developmentTime?: string; // 预计开发时间
  status?: string; // 用户当前的状态，如“正在寻找开发商”
  contactPhone?: string; // 用户的联系电话
  wechatId?: string; // 用户的微信ID
  industry?: string; // 用户所在的行业
  projectType?: string; // 项目的类型，如Web开发、移动应用等
  techStack?: string; // 客户偏好的技术栈
  decisionMaker?: string; // 关键决策人
  decisionStage?: string; // 客户在购买过程中的阶段
  serviceExpectations?: string; // 服务期望，详细描述客户希望实现的功能
  previousProvider?: string; // 客户以前的服务提供商
  satisfactionLevel?: string; // 客户对以前项目的满意度
  renewalIntent?: string; // 客户的续约意向
  notes?: string; // 对客户的额外备注信息
  createdAt: Date; // 记录创建的时间
}

const UserSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  ip: { type: String, required: true },
  ipLocation: { type: String },
  userAgent: { type: String, required: true },
  location: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  budget: { type: Number },
  numberOfUsers: { type: Number },
  developmentTime: { type: String },
  status: { type: String },
  contactPhone: { type: String },
  wechatId: { type: String },
  industry: { type: String },
  projectType: { type: String },
  techStack: { type: String },
  decisionMaker: { type: String },
  decisionStage: { type: String },
  serviceExpectations: { type: String },
  previousProvider: { type: String },
  satisfactionLevel: { type: String },
  renewalIntent: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
