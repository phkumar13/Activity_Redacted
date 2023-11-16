export const ActivityQuery = (prospectId: string, activity: string) => {
  return `SELECT TOP 1 Activity, [Status], ActivityDate FROM Activity.ActivityLog WHERE ProspectId = ${prospectId} AND (LEN(Activity) = 0 OR Activity = '${activity}') ORDER BY ActivityDate DESC`;
};

export const AllActivitiesQuery = (prospectId: string) => {
  return (
    'WITH Activites AS (SELECT ProspectId, Activity, [Status], ActivityDate, CreatedDate, ' +
    '		ROW_NUMBER() OVER(PARTITION BY ProspectId, Activity ORDER BY CreatedDate DESC) AS RowNum ' +
    'FROM	Activity.ActivityLog) ' +
    `SELECT Activity, [Status], ActivityDate FROM Activites WHERE RowNum = 1 AND ProspectId = ${prospectId}`
  );
};

export const AddActivityQuery = (
  prospectId: string,
  activity: string,
  status: string,
  activityDate: string
) => {
  return `INSERT INTO Activity.ActivityLog (ProspectId, Activity, [Status], ActivityDate) VALUES(${prospectId}, '${activity}', '${status}','${activityDate}')`;
};

export const ProspectQuery = (prospectId: string) => {
  return `SELECT ProspectId FROM Prospect.Prospect WHERE ProspectId = ${prospectId}`;
};
