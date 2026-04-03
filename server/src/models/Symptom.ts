import { Schema, model } from 'mongoose';

export interface ISymptom extends Document{
  userId: Schema.Types.ObjectId;
  symptomType: Schema.Types.ObjectId;
  severity: number;
  duration: string;
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
    symptomType: {
      type: Schema.Types.ObjectId,
      ref: 'SymptomType',
      required: true,
    },
    severity: {
      type: Number,
      required: true,
      min: 1, 
      max: 10,
    },
    duration: {
      type: String, 
      required: true,
    },
    possibleTrigger: {
      type: String,
      required: false, 
    },
    notes: {
      type: String, 
      required: true, 
    },

},
  {
    timestamps: true,
  }
);

const Symptom = model<ISymptom>('Symptom', symptomSchema);

export default Symptom;