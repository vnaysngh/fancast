import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { ufcConstants } from "../../../constants/ufcConstants";

type Fighter = {
  name: string;
  rank: number | string;
  url: string;
  weightClass: string; // Added weightClass property
  record?: string; // Optional record property
};

type WeightClass = keyof typeof ufcConstants;

const weightClasses: WeightClass[] = [
  "lightweight",
  "welterweight",
  "middleweight",
  "lightHeavyweight",
  "heavyweight"
];

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

export const Title = styled.h1`
  margin-bottom: 1rem;
`;

export const Description = styled.p`
  margin-bottom: 2rem;
`;

export const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

export const Tab = styled.button<{ active?: boolean }>`
  font-family: "Bungee";
  background: ${(props) => (props.active ? "#0d0c22" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#0d0c22")};
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
`;

export const WeightClassContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

export const WeightClassTitle = styled.h2`
  margin-bottom: 1rem;
`;

export const FighterList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const FighterCard = styled.div`
  background: #f4f4f4;
  border-radius: 8px;
  position: relative;
  padding: 1rem;
  width: 200px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #e0e0e0;
  }
`;

export const SelectedFighters = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const FighterImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

export const FighterName = styled.div`
  margin-top: 0.5rem;
`;

export const FighterRank = styled.div<{ champion: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${(props) => (props.champion ? "#daa520" : "#0d0c22")};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

export const Record = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

export const RemoveButton = styled.button`
  font-family: "Bungee";
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  &:hover {
    background: #e60000;
  }
`;

export const PredictionContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

export const VSContainer = styled.div`
  margin: 2rem 0;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
`;

export const Button = styled.button`
  font-family: "Bungee";
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  background: transparent;

  &:hover {
    background: #0d0c22;
    color: #fff;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  font-family: "Roboto Slab", sans-serif;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
`;

export const CustomPromptInput = styled.textarea`
  width: 100%;
  max-width: 500px;
  height: 100px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: solid 2px #888;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
`;

const FighterSelector: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [fighters, setFighters] = useState<any[]>([]);
  const [selectedFighters, setSelectedFighters] = useState<Fighter[]>([]);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");

  useEffect(() => {
    if (selectedTab === "all") {
      const allFighters = Object.values(ufcConstants).flat();
      setFighters(allFighters);
    } else {
      // Ensure `selectedTab` is a valid key of `ufcConstants`
      const categoryFighters = ufcConstants[selectedTab as WeightClass];
      setFighters(categoryFighters);
    }
  }, [selectedTab]);

  const handleFighterClick = (fighter: Fighter) => {
    if (
      selectedFighters.length < 2 &&
      !selectedFighters.some((f) => f.name === fighter.name)
    ) {
      setSelectedFighters((prev) => [...prev, fighter]);
    }
  };

  const handleRemoveFighter = (fighterToRemove: Fighter) => {
    setSelectedFighters((prev) =>
      prev.filter((fighter) => fighter.name !== fighterToRemove.name)
    );
  };

  const handlePredict = async () => {
    if (selectedFighters.length === 2) {
      const [fighter1, fighter2] = selectedFighters;

      try {
        const response = await axios.post(
          "https://api.openai.com/v1/completions",
          {
            prompt: `Predict the outcome of a fight between ${fighter1.name} and ${fighter2.name}.`,
            max_tokens: 150,
            temperature: 0.7,
            model: "text-davinci-003"
          },
          {
            headers: {
              Authorization: `Bearer YOUR_OPENAI_API_KEY`,
              "Content-Type": "application/json"
            }
          }
        );

        setPrediction(response.data.choices[0].text.trim());
      } catch (error) {
        console.error("Error getting prediction:", error);
        setPrediction("Error getting prediction.");
      }
    }
  };

  return (
    <Container>
      <Title>UFC Fighter Selector</Title>
      <Description>
        Select fighters from different weight classes to get predictions on how
        their fight might unfold. Choose any 2 fighters to generate an analysis.
      </Description>
      <Tabs>
        {weightClasses.map((weightClass) => (
          <Tab
            key={weightClass}
            active={weightClass === selectedTab}
            onClick={() => setSelectedTab(weightClass)}
          >
            {weightClass.charAt(0).toUpperCase() + weightClass.slice(1)}
          </Tab>
        ))}
      </Tabs>
      <SelectedFighters>
        {selectedFighters.length > 0 && (
          <>
            {selectedFighters.map((fighter, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <FighterImage src={fighter.url} alt={fighter.name} />
                <div>{fighter.name}</div>
                <div>
                  {fighter.weightClass.charAt(0).toUpperCase() +
                    fighter.weightClass.slice(1)}
                </div>
                {fighter.record && <Record>Record: {fighter.record}</Record>}
                <RemoveButton onClick={() => handleRemoveFighter(fighter)}>
                  Remove
                </RemoveButton>
              </div>
            ))}
          </>
        )}
        <div>
          {selectedFighters.length === 2 && (
            <VSContainer>
              {selectedFighters[0].name} <span>VS</span>{" "}
              {selectedFighters[1].name}
            </VSContainer>
          )}
          {selectedFighters.length === 2 && (
            <InputContainer>
              <CustomPromptInput
                placeholder="Enter custom prompt for prediction..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <Button onClick={handlePredict}>Get Prediction</Button>
            </InputContainer>
          )}
        </div>
      </SelectedFighters>

      {/* <Button onClick={handlePredict}>Create Prediction</Button> */}
      {fighters.length > 0 && (
        <WeightClassContainer>
          <WeightClassTitle>
            {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
          </WeightClassTitle>
          <FighterList>
            {fighters.map((fighter) => (
              <FighterCard
                key={fighter.name}
                onClick={() => handleFighterClick(fighter)}
              >
                <FighterImage src={fighter.url} alt={fighter.name} />
                <FighterName>{fighter.name}</FighterName>
                {selectedTab !== "all" && (
                  <FighterRank champion={fighter.rank === "C"}>
                    {fighter.rank}
                  </FighterRank>
                )}
              </FighterCard>
            ))}
          </FighterList>
        </WeightClassContainer>
      )}
      {prediction && (
        <PredictionContainer>
          <h2>Fight Analysis</h2>
          <p>{prediction}</p>
        </PredictionContainer>
      )}
    </Container>
  );
};

export default FighterSelector;
