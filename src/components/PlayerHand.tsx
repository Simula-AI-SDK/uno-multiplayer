import React from "react";
import { StyleSheet, View } from "react-native";
import { Card as UnoCard } from "../types/game";
import { Card } from "./Card";

type Props = {
  cards: UnoCard[];
  playableIds: Set<string>;
  onCardPress: (card: UnoCard) => void;
};

const splitIntoRows = (cards: UnoCard[]): UnoCard[][] => {
  const targetRows = cards.length > 15 ? 4 : cards.length > 10 ? 3 : cards.length > 5 ? 2 : 1;
  const rowCount = Math.min(4, targetRows);
  const perRow = Math.ceil(cards.length / rowCount);
  const rows: UnoCard[][] = [];
  for (let i = 0; i < cards.length; i += perRow) rows.push(cards.slice(i, i + perRow));
  return rows;
};

export const PlayerHand: React.FC<Props> = ({ cards, playableIds, onCardPress }) => {
  const rows = splitIntoRows(cards);
  const useCompact = rows.length >= 3;

  return (
    <View style={styles.dock}>
      <View style={styles.wrap}>
        {rows.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} style={styles.row}>
            {row.map((card) => (
              <View key={card.id} style={styles.slot}>
                <Card
                  card={card}
                  compact={useCompact}
                  playable={playableIds.has(card.id)}
                  onPress={() => onCardPress(card)}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dock: {
    width: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 6,
    backgroundColor: "transparent"
  },
  wrap: {
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 0,
    rowGap: 6
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
  slot: {
    marginHorizontal: 2
  }
});
