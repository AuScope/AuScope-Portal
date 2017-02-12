@ECHO OFF

IF "%1" == "" GOTO RUN_WAR
IF "%1" == "-b" GOTO BUILD
IF "%1" == "-r" GOTO RUN
GOTO END

:BUILD
call mvn package
GOTO END

:RUN
mvn -DskipTests=true package jetty:run
GOTO END

:RUN_WAR
call mvn -DskipTests=true jetty:run-war
:END
