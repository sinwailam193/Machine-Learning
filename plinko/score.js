const outputs = [];
const k = 3;

function distance(point, distancePoint) {
    return Math.abs(point - distancePoint);
}

function splitDateset(data, testCount) {
    const shuffled = _.shuffle(data);
    const testSet = _.slice(shuffled, 0, testCount);
    const trainingSet = _.slice(shuffled, testCount);
    return [testSet, trainingSet];
}

function knn(data, distancePoint) {
    return _.chain(data)
        .map(([dropPosition, bounciness, size, bucketLabel]) => [
          distance(dropPosition, distancePoint),
          bucketLabel
        ])
        .sortBy(row => row[0])
        .slice(0, k)
        .countBy(([val, label]) => label)
        .toPairs()
        .sortBy(row => row[1])
        .last()
        .first()
        .parseInt()
        .value();
}

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    // Ran every time a balls drops into a bucket
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
    // Write code here to analyze stuff
    const testSetSize = 10;
    let numberCorrect = 0;
    const [testSet, trainingSet] = splitDateset(outputs, testSetSize);
    for (let i = 0; i < testSet.length; i++) {
        const bucket = knn(trainingSet, testSet[i][0]);
        if (bucket === testSet[i][3]) {
            numberCorrect++;
        }
    }

    const accuracy = _.chain(testSet)
        .filter(testPoint => knn(trainingSet, testPoint[0]) === testPoint[3])
        .size()
        .divide(testSetSize)
        .value();

    console.log("Accuracy:", accuracy);
}
