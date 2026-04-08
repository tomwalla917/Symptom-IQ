import { Schema, model } from 'mongoose';

export interface ISymptom extends Document{
  userId: Schema.Types.ObjectId;
  name: string;
  severity: number;
  duration: string;
  date: Date;
  possibleTrigger: string;
  notes: string;
  createdAt: Date;
}

export interface ISymptom extends Document {
  userId: Schema.Types.ObjectId;
  name: string;          // was symptomType ObjectId — simplify to string to match frontend dropdown
  severity: number;
  date: Date;            // new
  possibleTrigger: string;
  notes: string;
  createdAt: Date;
}

const symptomSchema = new Schema<ISymptom>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    severity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    date: {
      type: Date,
      required: false,
    },
    possibleTrigger: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Symptom = model<ISymptom>('Symptom', symptomSchema);

export default Symptom;