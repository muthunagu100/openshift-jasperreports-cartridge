--
--
-- 5.5.0 to 6.0
--
-- Bug 23374 - [case #20392] Large Dashboard elements breaks Postgres 
--

-- add and populate new columns for JIReportJobMail table 
ALTER TABLE JIDashboardFrameProperty ALTER COLUMN propertyValue nvarchar(5000);
