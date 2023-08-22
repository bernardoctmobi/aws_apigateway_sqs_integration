export const handler = async (event) => {
  const records = event.Records;
  console.log(records);
  
  const promisesArray = records.map(record => createPromiseForRecord(record));
  const results = await Promise.allSettled(promisesArray);
  console.log(results);
  const rejectedRecords = results.filter((item) => item.status === "rejected");
  console.log(rejectedRecords);
  const batchItemFailures = rejectedRecords.map(item => ({itemIdentifier:item.reason}));
  console.log(batchItemFailures);
  return {batchItemFailures};
};

async function createPromiseForRecord(record) {
  const parsedBody = JSON.parse(record.body);
  const result = (typeof(parsedBody.firstNumber) == "number" && typeof(parsedBody.secondNumber) == "number");
  if (!result) {
    throw record.messageId;
  }
  return (parsedBody.firstNumber + parsedBody.secondNumber);
}