export const calculateExpression = ({ categories, sleepStartRef, now }) => {
  const get = (name) =>
    categories.find((c) => c.categoryName === name)?.score || 0;

  const smile = get("mouthSmileLeft") + get("mouthSmileRight");
  const eyeClosed = get("eyeBlinkLeft") + get("eyeBlinkRight");

  const jawOpen = get("jawOpen");
  const eyeWide = get("eyeLookDownLeft") + get("eyeLookDownRight");
  const browUp = get("browOuterUpLeft") + get("browOuterUpRight");

  const surpriseScore = jawOpen + eyeWide + browUp;

  const frown = get("browDownLeft") + get("browDownRight");
  const mouthDown = (get("eyeSquintLeft") + get("eyeSquintRight")) / 2;
  const sadScore = frown + mouthDown * 0.2;

  let newExpression = "Neutral";
  let maxScore = 0.5;

  if (smile > maxScore) {
    maxScore = smile;
    newExpression = "Happy";
  }

  // Sleeping logic
  if (eyeClosed > 1.2) {
    if (!sleepStartRef.current) {
      sleepStartRef.current = now;
    }

    if (now - sleepStartRef.current > 1500) {
      newExpression = "Sleeping";
    }
  } else {
    sleepStartRef.current = null;
  }

  if (surpriseScore > maxScore && jawOpen > 0.5 && eyeWide > 0.4) {
    maxScore = surpriseScore;
    newExpression = "Surprise";
  }

  if (sadScore > maxScore && smile < 0.5 && jawOpen < 0.4) {
    maxScore = sadScore;
    newExpression = "Sad";
  }

  return newExpression;
};
