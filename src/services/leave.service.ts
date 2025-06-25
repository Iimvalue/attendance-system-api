import {Leave,ILeave} from '../models/leave.model';

export const createLeave = async (leaveData: ILeave): Promise<ILeave> => {
    const leave =  await Leave.create(leaveData);
    return leave;
}
export const getAllLeaves = async (): Promise<ILeave[]> => {
    const leaves = await Leave.find()
        .populate('studentId', 'email role')
        .populate('classId', 'name')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leaves;
}

export const getLeavesByClass = async (classId: string): Promise<ILeave[]> => {
    const leaves = await Leave.find({ classId })
        .populate('studentId', 'email role')
        .populate('classId', 'name')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leaves;
}

export const getLeavesByUser = async (userId: string): Promise<ILeave[]> => {
    const leaves = await Leave.find({ studentId: userId }).populate('classId').populate('acceptedBy', 'email role').populate('rejectedBy', 'email role');
    return leaves;
}

export const acceptLeave = async (leaveId: string, userId: string): Promise<ILeave | null> => {
    const existingLeave = await Leave.findById(leaveId);
    if (!existingLeave) {
        throw new Error('Leave not found');
    }
    if (existingLeave.acceptedBy || existingLeave.rejectedBy) {
        throw new Error('Leave has already been processed');
    }

    const leave = await Leave.findByIdAndUpdate(
        leaveId,
        {
            acceptedBy: userId,
            acceptedAt: new Date(),
        },
        { new: true }
    )
        .populate('classId', 'name')
        .populate('studentId', 'email role')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leave;
}

export const rejectLeave = async (leaveId: string, userId: string): Promise<ILeave | null> => {
    const existingLeave = await Leave.findById(leaveId);
    if (!existingLeave) {
        throw new Error('Leave not found');
    }
    if (existingLeave.acceptedBy || existingLeave.rejectedBy) {
        throw new Error('Leave has already been processed');
    }

    const leave = await Leave.findByIdAndUpdate(
        leaveId,
        {
            rejectedBy: userId,
            rejectedAt: new Date(),
        },
        { new: true }
    )
        .populate('classId', 'name')
        .populate('studentId', 'email role')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leave;
}

export const deleteLeave = async (leaveId: string): Promise<ILeave | null> => {
    const leave = await Leave.findByIdAndDelete(leaveId)
        .populate('classId', 'name')
        .populate('studentId', 'email role')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leave;
}


