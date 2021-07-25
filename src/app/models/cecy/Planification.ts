import { Timestamp } from "rxjs/internal/operators/timestamp";
import { Status } from "../app/status";
import { User } from "../auth/user";
import { Course } from "./Course";

export interface Planification {

    id?: number;
    date_start: Date;
    date_end: Date;
    needs: JSON;
    course: Course;
    user: User;
    status: Status;
  
}
