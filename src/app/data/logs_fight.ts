export class LogsFight{
    value: number;
    type: LogsEnum;
}

export enum LogsEnum{
    Dodge,
    DamageDealt,
    DamageTaken,
    Miss
}