import React, { useState, useRef } from 'react';
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

export default function App() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [fastestLap, setFastestLap] = useState(null);
  const [slowestLap, setSlowestLap] = useState(null);
  const intervalRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(2);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const startTimer = () => {
    if (!running) {
      const startTime = Date.now() - timeElapsed;
      intervalRef.current = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 10);
      setRunning(true);
    }
  };

  const stopTimer = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    }
  };

  const resetTimer = () => {
    if (running) {
      recordLap();
    } else {
      clearInterval(intervalRef.current);
      setTimeElapsed(0);
      setRunning(false);
      setLaps([]);
      setFastestLap(null);
      setSlowestLap(null);
    }
  };

  const recordLap = () => {
    const lapTime = formatTime(timeElapsed);
    setLaps(prevLaps => [lapTime, ...prevLaps]);

    if (!fastestLap || lapTime < fastestLap) {
      setFastestLap(lapTime);
    }

    if (!slowestLap || lapTime > slowestLap) {
      setSlowestLap(lapTime);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(timeElapsed)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={[styles.button, running ? styles.lapButton : styles.resetButton]} onPress={running ? recordLap : resetTimer}>
            <Text style={styles.buttonText}>{running ? 'Lap' : 'Reset'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={[styles.button, running ? styles.stopButton : styles.startButton]} onPress={running ? stopTimer : startTimer}>
            <Text style={running ? styles.stopText : styles.startText}>{running ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.listContainer}>
        {laps.length > 0 && (
          <FlatList
            data={laps}
            renderItem={({ item, index }) => (
              <View>
                <View style={styles.lapItemContainer}>
                  <Text style={[styles.lapText, styles.left, item === fastestLap && styles.fastestLap, item === slowestLap && styles.slowestLap]}>
                    {`Lap ${laps.length - index}`}
                  </Text>
                  <Text style={[styles.lapText, styles.right, item === fastestLap && styles.fastestLap, item === slowestLap && styles.slowestLap]}>
                    {item}
                  </Text>
                </View>
                {index < laps.length - 1 && <View style={styles.separator} />}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.lapList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  timerContainer: {
    flex: 2,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center'
  },
  timer: {
    fontSize: 70,
    color: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    flex: 1,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginHorizontal: 90
  },
  button: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
    elevation: 3,
    borderWidth: 1,
  },
  buttonText: {
    color: '#F7F7F7',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#0D2912',
  },
  stopButton: {
    backgroundColor: '#340E0B',
  },
  resetButton: {
    backgroundColor: '#333333', 
  },
  lapButton: {
    backgroundColor: '#333333',
  },
  lapText: {
    fontSize: 16,
    color: '#FFF',
  },
  lapItemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10
  },
  lapList: {
    flex: 1,
    alignSelf: 'stretch',
  },
  listContainer:{
    flex: 2
  },
  startText:{
    color: '#29BA53',
    fontSize: 16,
  },
  stopText:{
    color: '#E13B33',
    fontSize: 16,
  },
  right:{
    marginLeft: 130
  },
  left:{
    marginRight: 130
  },
  fastestLap: {
    color: '#29BA53', // Màu xanh
  },
  slowestLap: {
    color: '#E13B33', // Màu đỏ
  },
  separator: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#FFF',
  },
});
