import Employee from "./Employee.js";

class ZooKeeper extends Employee {
  constructor(
    name: string,
    id: number,
    title: string,
    salary: number,
    private specialty: string
  ) {
    super(name, id, title, salary);
    this.specialty = specialty;
  }

  getSpecialty(): string {
    return this.specialty;
  }
}
export default ZooKeeper;
