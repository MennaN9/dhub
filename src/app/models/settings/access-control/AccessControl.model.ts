// model for both Agent & Manager Access Control
export class AccessControl {
  roleName: string;
  permissions: string[];
}

export class AccessControlGroup {
  name: string;
  permissions: { name: string; value: string; isChecked }[];
}
